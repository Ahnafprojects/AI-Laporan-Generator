import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await req.json();

  // 1. Cek apakah kodenya benar
  if (code !== process.env.PRO_REDEEM_CODE) {
    return NextResponse.json({ error: "Kode voucher salah atau tidak valid!" }, { status: 400 });
  }

  try {
    // 2. Cari User
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 3. Cek apakah user sudah PRO aktif
    if (user.proExpiresAt && new Date(user.proExpiresAt) > new Date()) {
      return NextResponse.json({ error: "Anda sudah memiliki membership PRO yang aktif!" }, { status: 400 });
    }

    // 4. Tambah Masa Aktif PRO (+30 Hari dari sekarang)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // 5. Update Database dan buat transaction record
    await prisma.$transaction([
      // Update user
      prisma.user.update({
        where: { email: session.user.email },
        data: {
          isPro: true,
          proExpiresAt: expiryDate,
        },
      }),
      // Create transaction record untuk tracking
      prisma.transaction.create({
        data: {
          orderId: `REDEEM_${Date.now()}_${user.id}`,
          amount: 0, // Redeem code gratis
          status: "settlement",
          snapToken: null,
          userId: user.id,
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Selamat! Akun Anda sekarang PRO selama 1 bulan.",
      expiryDate: expiryDate.toISOString()
    });

  } catch (error) {
    console.error("Redeem error:", error);
    return NextResponse.json({ error: "Gagal memproses kode." }, { status: 500 });
  }
}