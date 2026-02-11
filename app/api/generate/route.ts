import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // PENTING
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { checkDailyUsage, incrementDailyUsage } from "@/lib/rate-limit";

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

    // Check AI quota in a single shared helper to keep limits consistent across AI endpoints.
    const rateLimitCheck = await checkDailyUsage();
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error },
        { status: rateLimitCheck.status || 429 }
      );
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

    // Increment usage only for successful AI generations.
    await incrementDailyUsage(user.id);

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
