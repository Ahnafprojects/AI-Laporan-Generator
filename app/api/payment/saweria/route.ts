import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Data dari Saweria biasanya bentuknya begini:
    // {
    //   "version": "2",
    //   "created_at": "2024-01-26T10:00:00Z",
    //   "id": "donasi-id-unik",
    //   "type": "donation",
    //   "amount_raw": 20000,
    //   "donator_name": "Ahnaf",
    //   "donator_email": "ahnaf@gmail.com",
    //   "message": "Ini email saya bang: ahnaf@gmail.com" 
    // }

    // 1. Validasi Keamanan Sederhana (Opsional tapi bagus)
    // Bisa pakai query param ?secret=kode_rahasia di URL webhook nanti

    // 2. Cek Nominal
    // Misalnya harga PRO Rp 20.000. Kalau kurang, anggap sedekah biasa.
    if (data.amount_raw < 20000) {
      return NextResponse.json({ message: "Nominal kurang untuk PRO, terima kasih donasinya!" });
    }

    // 3. Ambil Email User
    // Strategi: Cek donator_email dulu. Kalau login saweria beda sama login app,
    // kita minta user tulis email di kolom pesan.
    
    let targetEmail = data.donator_email;
    
    // Cek apakah di pesan ada email? (Regex sederhana cari email)
    const emailInMessage = data.message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailInMessage) {
      targetEmail = emailInMessage[0];
    }

    console.log(`Menerima donasi dari: ${targetEmail}, Nominal: ${data.amount_raw}`);

    // 4. Update Database User
    const user = await prisma.user.findUnique({ where: { email: targetEmail } });

    if (!user) {
      console.log("User tidak ditemukan di database kita.");
      return NextResponse.json({ message: "User not found" });
    }

    // Aktifkan PRO 30 Hari
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await prisma.user.update({
      where: { email: targetEmail },
      data: {
        isPro: true,
        proExpiresAt: expiryDate,
      },
    });

    // Opsional: Simpan riwayat transaksi di tabel Transaction (buat laporan)
    await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: data.id, // ID dari Saweria
        amount: data.amount_raw,
        status: "success",
        snapToken: "saweria-direct",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Saweria Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}