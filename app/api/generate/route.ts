import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // PENTING
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. CEK AUTHENTICATION
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please Login." }, { status: 401 });
    }

    // 2. AMBIL DATA USER DARI DB (Untuk Cover)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Cek Status PRO User - based on expiry date, not isPro flag
    const isProActive = user.proExpiresAt && new Date(user.proExpiresAt) > new Date();

    // 2. Tentukan Limit berdasarkan status PRO
    const DAILY_LIMIT = isProActive ? 50 : 3; // Pro 50, Free 3

    // 3. Hitung usage hari ini dari DailyUsage table
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cek atau buat record usage hari ini
    let dailyUsage = await prisma.dailyUsage.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    // Jika belum ada record hari ini, buat baru
    if (!dailyUsage) {
      dailyUsage = await prisma.dailyUsage.create({
        data: {
          userId: user.id,
          date: today,
          usageCount: 0,
        },
      });
    }

    // 4. Tolak jika over limit
    if (dailyUsage.usageCount >= DAILY_LIMIT) {
      return NextResponse.json({ 
        error: isProActive 
          ? "Limit Pro harian habis (50 laporan)." 
          : "Limit Gratis habis! Upgrade ke PRO untuk 50 laporan/hari." 
      }, { status: 429 });
    }

    const body = await req.json();
    
    // Construct Prompt dengan data dari DB + Input Form
    const userPrompt = `
      BUAT LAPORAN RESMI PENS.
      
      DATA MAHASISWA:
      Nama: ${user.name}
      NRP: ${user.nrp}
      Kelas: ${user.kelas}
      
      DATA PRAKTIKUM:
      Mata Kuliah: ${body.subject}
      Judul: ${body.title}
      Dosen: ${body.lecturer}
      
      SOAL / MODUL:
      ${body.labSheet}
      
      KODE JAWABAN MAHASISWA (Jika ada):
      ${body.codeContent || "Tidak ada kode."}
      
      (Jika ada gambar soal, analisa gambar tersebut juga).
    `;

    // Kirim ke Groq (Versi Llama 3 Vision Preview jika support gambar, atau text only jika Groq standar)
    // Note: Groq Llama 3 70B saat ini text-only. Jika mau gambar, harus pakai model 'llama-3.2-11b-vision-preview' di Groq
    // Mari kita pakai model text dulu agar aman, gambar disimpan saja di DB.
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "openai/gpt-oss-20b", // Model yang stabil
    });

    const generatedText = completion.choices[0]?.message?.content || "";

    // Simpan ke DB
    const report = await prisma.report.create({
      data: {
        userId: user.id, // Link ke User
        title: body.title,
        subject: body.subject,
        lecturer: body.lecturer,
        practiceDate: new Date(body.practiceDate),
        labSheet: body.labSheet,
        codeContent: body.codeContent,
        labImage: body.labImage, // Simpan base64 gambar
        generatedReport: generatedText,
        aiModel: "groq-llama3-70b",
        status: "completed",
      },
    });

    // INCREMENT DAILY USAGE COUNT (Tidak berkurang meski laporan dihapus)
    await prisma.dailyUsage.update({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}