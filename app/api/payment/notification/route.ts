import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const midtransServerKey = process.env.MIDTRANS_SERVER_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verifikasi signature dari Midtrans (opsional tapi sangat disarankan)
    // const receivedSignature = request.headers.get("x-signature");
    
    const { order_id, transaction_status, fraud_status } = body;
    
    console.log("Midtrans notification:", { order_id, transaction_status, fraud_status });

    // Cari transaksi di database
    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    let newStatus = "pending";
    let shouldUpgradeToPro = false;

    // Handle status berdasarkan response Midtrans
    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || fraud_status === null) {
        newStatus = "success";
        shouldUpgradeToPro = true;
      }
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (transaction_status === "deny" || transaction_status === "expire" || transaction_status === "cancel") {
      newStatus = "failed";
    }

    // Update status transaksi
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: newStatus },
    });

    // Jika berhasil, upgrade user ke PRO
    if (shouldUpgradeToPro) {
      const proExpiresAt = new Date();
      
      // Tentukan durasi berdasarkan order_id
      if (order_id.includes("PRO-YEARLY")) {
        // Yearly plan: 1 tahun
        proExpiresAt.setFullYear(proExpiresAt.getFullYear() + 1);
      } else {
        // Monthly plan: 1 bulan (default)
        proExpiresAt.setMonth(proExpiresAt.getMonth() + 1);
      }

      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          isPro: true,
          proExpiresAt: proExpiresAt,
        },
      });

      const planType = order_id.includes("PRO-YEARLY") ? "yearly" : "monthly";
      console.log(`User ${transaction.user.email} upgraded to PRO (${planType}) until ${proExpiresAt}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}