import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { checkDailyUsage, incrementDailyUsage } from "@/lib/rate-limit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    // Check rate limit FIRST
    const rateLimitCheck = await checkDailyUsage(3);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: rateLimitCheck.error,
        currentUsage: rateLimitCheck.currentUsage,
        maxUsage: rateLimitCheck.maxUsage,
        isPro: rateLimitCheck.isPro
      }, { status: rateLimitCheck.status });
    }

    const { name, university, major, position, company, skills, experience, language = "indonesian" } = await req.json();

    const systemPrompt = language === "english" 
      ? `You are a Professional Career Consultant specializing in creating compelling Cover Letters that impress HR managers and hiring teams.`
      : `Kamu adalah Konsultan Karir HRD Profesional yang ahli membuat Cover Letter (Surat Lamaran Kerja) yang sangat persuasif dan mengesankan.`;
    
    const userPrompt = language === "english" 
      ? `
    Create a professional Cover Letter with the following information:
    
    Applicant Data:
    - Name: ${name}
    - University: ${university}
    - Major/Program: ${major || "Not specified"}
    - Position Applied: ${position}
    - Target Company: ${company}
    - Key Skills: ${skills}
    - Relevant Experience: ${experience || "Fresh graduate with strong learning ability"}
    
    IMPORTANT GUIDELINES:
    - DO NOT invent specific numbers, percentages, or metrics unless explicitly provided in the experience section
    - Use qualitative descriptions instead of quantitative ones (e.g., "significantly improved" instead of "improved by 30%")
    - Focus on skills, potential, and genuine enthusiasm
    - Use words like "effectively", "successfully", "consistently", "actively contributed" instead of fake metrics
    - If mentioning achievements, use general terms like "strong results", "positive impact", "notable contribution"
    
    Format Requirements:
    1. Proper business letter format with date and recipient address
    2. Professional greeting to Hiring Manager
    3. Opening paragraph: Strong hook explaining interest in the company and position
    4. Body paragraph: Connect skills and experience to job requirements with authentic examples
    5. Closing paragraph: Show enthusiasm and request for interview
    6. Professional sign-off
    7. Use professional tone but engaging, not robotic
    
    Output Format:
    [Date]
    
    Dear Hiring Manager,
    [Company Name]
    
    [Body paragraphs...]
    
    Sincerely,
    ${name}
    `
      : `
    Buatkan Cover Letter profesional dengan data berikut:
    
    Data Pelamar:
    - Nama: ${name}
    - Universitas: ${university}
    - Jurusan: ${major || "Tidak disebutkan"}
    - Posisi yang dilamar: ${position}
    - Perusahaan Tujuan: ${company}
    - Skill Utama: ${skills}
    - Pengalaman Relevan: ${experience || "Fresh graduate yang cepat belajar dan adaptif"}
    
    PANDUAN PENTING:
    - JANGAN buat angka, persentase, atau metrik palsu kecuali sudah disebutkan jelas di bagian pengalaman
    - Gunakan deskripsi kualitatif daripada kuantitatif (contoh: "berhasil meningkatkan" bukan "meningkatkan 30%")
    - Fokus pada kemampuan, potensi, dan antusiasme yang genuine
    - Gunakan kata seperti "secara efektif", "berhasil", "konsisten", "aktif berkontribusi" daripada metrik palsu
    - Jika menyebutkan prestasi, gunakan istilah umum seperti "hasil yang baik", "dampak positif", "kontribusi yang berarti"
    - Berikan contoh konkret tapi tidak dengan angka palsu
    
    Format yang Diinginkan:
    1. Format surat resmi dengan tanggal dan alamat penerima
    2. Salam pembuka yang profesional (Kepada Yth. HRD Manager/Tim Rekrutmen)
    3. Paragraf pembuka: Hook yang kuat menjelaskan ketertarikan pada perusahaan dan posisi
    4. Paragraf isi: Hubungkan skill dan pengalaman dengan kebutuhan posisi, berikan contoh autentik
    5. Paragraf penutup: Tunjukkan antusiasme dan permintaan wawancara
    6. Penutup yang profesional
    7. Gunakan nada profesional tapi engaging, tidak kaku seperti robot
    
    Contoh kata-kata yang BAIK:
    - "Berhasil memimpin proyek tim"
    - "Aktif berkontribusi dalam pengembangan"
    - "Menunjukkan kemampuan adaptasi yang tinggi"
    - "Memiliki track record yang solid dalam"
    - "Menguasai dengan baik"
    
    Contoh kata-kata yang HINDARI:
    - "Meningkatkan efisiensi 25%" (kecuali ada di data pengalaman)
    - "Mengelola 50+ klien" (kecuali disebutkan eksplisit)
    - "ROI 200%" atau angka palsu lainnya
    
    Format Output:
    [Tanggal]
    
    Kepada Yth. HRD Manager
    ${company}
    
    Dengan hormat,
    
    [Isi surat...]
    
    Hormat saya,
    ${name}
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || "";

    // Increment usage count setelah berhasil
    if (rateLimitCheck.userId) {
      await incrementDailyUsage(rateLimitCheck.userId);
    }

    return NextResponse.json({ 
      content: generatedText,
      language: language,
      metadata: {
        name,
        university,
        major,
        position,
        company,
        generatedAt: new Date().toISOString()
      },
      usageInfo: {
        currentUsage: (rateLimitCheck.currentUsage || 0) + 1,
        maxUsage: rateLimitCheck.maxUsage,
        isPro: rateLimitCheck.isPro
      }
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json({ 
      error: "Gagal generate cover letter" 
    }, { status: 500 });
  }
}