import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

const midtransServerKey = process.env.MIDTRANS_SERVER_KEY!;
// Use production URL
const midtransUrl = "https://app.midtrans.com/snap/v1/transactions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get plan from request body
    const { plan = "monthly" } = await req.json();

    // Debug: Log server key (hanya sebagian untuk keamanan)
    console.log("Server key starts with:", midtransServerKey?.substring(0, 10));
    
    if (!midtransServerKey) {
      console.error("MIDTRANS_SERVER_KEY not found in environment");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    // Get user dari database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cek apakah sudah PRO
    const isProActive = user.isPro && user.proExpiresAt && new Date(user.proExpiresAt) > new Date();
    if (isProActive) {
      return NextResponse.json({ error: "Already PRO member" }, { status: 400 });
    }

    // Plan pricing and details
    const planDetails = {
      monthly: { 
        amount: 20000, 
        name: "PRO Monthly", 
        duration: "1 bulan",
        description: "Membership PRO untuk 1 bulan" 
      },
      yearly: { 
        amount: 180000, 
        name: "PRO Yearly", 
        duration: "1 tahun",
        description: "Membership PRO untuk 1 tahun (Hemat 25%)" 
      }
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.monthly;

    // Generate unique order ID (max 50 chars untuk Midtrans)
    // Format: PRO-M/Y-shortened_user_id-timestamp_suffix
    const shortUserId = user.id.slice(-8); // Ambil 8 karakter terakhir dari user ID
    const timestampSuffix = Date.now().toString().slice(-8); // Ambil 8 digit terakhir timestamp
    const planPrefix = plan === 'monthly' ? 'M' : 'Y';
    const orderId = `PRO-${planPrefix}-${shortUserId}-${timestampSuffix}`;

    console.log("Generated orderId:", orderId, "Length:", orderId.length);

    // Payload untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPlan.amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: `pro-${plan}`,
          price: selectedPlan.amount,
          quantity: 1,
          name: selectedPlan.name,
          category: "Subscription",
        },
      ],
    };

    // Request ke Midtrans untuk mendapatkan Snap Token
    console.log("Making request to Midtrans with orderId:", orderId);
    
    const authString = Buffer.from(midtransServerKey + ":").toString("base64");
    console.log("Auth string length:", authString.length);
    
    const midtransResponse = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
        Accept: "application/json",
      },
      body: JSON.stringify(parameter),
    });

    const midtransData = await midtransResponse.json();
    console.log("Midtrans response status:", midtransResponse.status);
    console.log("Midtrans response data:", midtransData);

    if (!midtransResponse.ok) {
      console.error("Midtrans error details:", midtransData);
      throw new Error(midtransData.error_messages?.[0] || `HTTP ${midtransResponse.status}: ${JSON.stringify(midtransData)}`);
    }

    // Simpan transaksi ke database dengan status pending
    await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: orderId,
        amount: selectedPlan.amount,
        status: "pending",
        snapToken: midtransData.token,
      },
    });

    return NextResponse.json({ 
      snapToken: midtransData.token,
      orderId: orderId 
    });

  } catch (error: any) {
    console.error("Payment charge error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}