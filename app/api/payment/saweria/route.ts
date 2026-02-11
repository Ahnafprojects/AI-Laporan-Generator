import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const rawBody = await req.text();

    let parsedBody: any = {};
    if (contentType.includes("application/json")) {
      parsedBody = JSON.parse(rawBody || "{}");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = new URLSearchParams(rawBody);
      parsedBody = Object.fromEntries(form.entries());
    } else {
      try {
        parsedBody = JSON.parse(rawBody || "{}");
      } catch {
        parsedBody = {};
      }
    }

    // Beberapa provider webhook membungkus payload pada key `data`.
    const data = parsedBody?.data && typeof parsedBody.data === "object" ? parsedBody.data : parsedBody;

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

    // 2. Cek nominal secara robust (exact fee + toleransi small unique code).
    // Base plan:
    // - Monthly: 5k / 20k
    // - Yearly: 45k / 180k
    // Fee references: QRIS(0.7%), GoPay(2%), OVO(2.74%), LinkAja(1.69%), Admin(5%)
    const FEES = [0.007, 0.02, 0.0274, 0.0169, 0.05];
    const EXACT_TOLERANCE = 500; // toleransi unique code / pembulatan kecil

    const yearlyBases = [180000, 45000];
    const monthlyBases = [20000, 5000];

    const calculateWithFees = (baseAmount: number) =>
      FEES.map((fee) => Math.round(baseAmount * (1 + fee)));

    const amountRaw = Number(data?.amount_raw || data?.amount || 0);
    console.log(`Received amount: ${amountRaw}`);

    const classifyPlan = (amount: number): "monthly" | "yearly" | null => {
      const plans = [
        ...monthlyBases.map((base) => ({ plan: "monthly" as const, base })),
        ...yearlyBases.map((base) => ({ plan: "yearly" as const, base })),
      ];

      // 1) Cek exact-ish terhadap base + fee references
      for (const item of plans) {
        const candidates = [item.base, ...calculateWithFees(item.base)];
        if (candidates.some((v) => Math.abs(v - amount) <= EXACT_TOLERANCE)) {
          return item.plan;
        }
      }

      // 2) Fallback: allow dynamic fee range jika provider mengubah fee tipis
      for (const item of plans) {
        const maxExtra = Math.max(1500, Math.round(item.base * 0.08)); // sampai +8% / min 1500
        if (amount >= item.base && amount <= item.base + maxExtra) {
          return item.plan;
        }
      }

      return null;
    };

    const plan = classifyPlan(amountRaw);
    if (!plan) {
      console.log(`Nominal ${amountRaw} tidak valid untuk PRO`);
      return NextResponse.json({ message: "Nominal tidak valid untuk upgrade PRO, terima kasih donasinya!" });
    }

    console.log(`✅ Nominal ${amountRaw} valid untuk PRO upgrade. Plan: ${plan}`);

    // 3. Ambil Email User
    // Strategi: Cek donator_email dulu. Kalau login saweria beda sama login app,
    // kita minta user tulis email di kolom pesan.
    
    let targetEmail = String(data?.donator_email || "").trim().toLowerCase();
    
    // Cek apakah di pesan ada email? (Regex sederhana cari email)
    const message = String(data?.message || "");
    const emailInMessage = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailInMessage) {
      targetEmail = emailInMessage[0].trim().toLowerCase();
    }

    if (!targetEmail) {
      console.log("Email user tidak ditemukan di payload Saweria.");
      return NextResponse.json({ message: "Email tidak ditemukan di payload." }, { status: 400 });
    }

    console.log(`Menerima donasi dari: ${targetEmail}, Nominal: ${amountRaw}`);

    // 4. Update Database User
    const user = await prisma.user.findUnique({ where: { email: targetEmail } });

    if (!user) {
      console.log("User tidak ditemukan di database kita.");
      return NextResponse.json({ message: "User not found" });
    }

    // Tentukan paket berdasarkan hasil klasifikasi nominal.
    const isYearly = plan === "yearly";

    // Jika user masih aktif PRO, extend dari tanggal expired sekarang.
    const baseDate = user.proExpiresAt && new Date(user.proExpiresAt) > new Date()
      ? new Date(user.proExpiresAt)
      : new Date();
    const expiryDate = new Date(baseDate);
    if (isYearly) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    await prisma.user.update({
      where: { email: targetEmail },
      data: {
        isPro: true,
        proExpiresAt: expiryDate,
      },
    });

    // Opsional: Simpan riwayat transaksi di tabel Transaction (buat laporan)
    const orderId = String(data?.id || data?.transaction_id || `saweria-${Date.now()}`);
    await prisma.transaction.upsert({
      where: { orderId },
      create: {
        userId: user.id,
        orderId, // ID dari Saweria
        amount: amountRaw,
        status: "settlement",
        snapToken: "saweria-direct",
      },
      update: {
        userId: user.id,
        amount: amountRaw,
        status: "settlement",
        snapToken: "saweria-direct",
      }
    });

    return NextResponse.json({ success: true, plan: isYearly ? "yearly" : "monthly", proExpiresAt: expiryDate });

  } catch (error) {
    console.error("Saweria Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
