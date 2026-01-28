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

    const { text, type, lang } = await req.json();

    console.log("CV Optimize Request:", { text, type, lang });

    if (!text || text.trim().length < 5) {
      return NextResponse.json({ 
        success: false, 
        error: "Please provide more content to optimize" 
      }, { status: 400 });
    }

    // 1. Auto-detect language
    const isIndonesian = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text) || 
                        /\b(dan|atau|dengan|untuk|yang|adalah|saya|kami|pada|dari|ke|di|akan|sudah|telah|bisa|dapat|harus|juga|sangat|lebih|paling)\b/i.test(text);
    
    const detectedLang = isIndonesian ? 'id' : 'en';
    const useLang = lang || detectedLang;

    // 2. Build Prompt
    let systemPrompt = "";
    if (type === "summary") {
      systemPrompt = `You are a professional Resume Writer. Take the user's rough summary and rewrite it professionally. Use ONLY the information provided - do NOT add fake experiences, skills, or achievements.

CRITICAL INSTRUCTIONS:
- IMPORTANT: Respond in ${useLang === 'id' ? 'Indonesian (Bahasa Indonesia)' : 'English'} language
- Use ONLY the information provided in the input text
- DO NOT add experiences, companies, or skills that weren't mentioned
- DO NOT make up achievements or numbers
- Keep it 2-3 sentences maximum
- Make the existing content sound professional
- Return ONLY the rewritten summary, NO explanations

User's input: "${text}"

Rewrite professionally using ONLY the provided information:`;
    } else if (type === "bullet") {
      systemPrompt = `You are a professional Resume Writer. Convert the user's rough job description into 3-4 professional bullet points. Use ONLY the information provided - do NOT add fake tasks or achievements.

CRITICAL INSTRUCTIONS:
- IMPORTANT: Respond in ${useLang === 'id' ? 'Indonesian (Bahasa Indonesia)' : 'English'} language
- Use ONLY the tasks and responsibilities mentioned in the input
- DO NOT add tasks, projects, or achievements that weren't mentioned
- DO NOT make up numbers, percentages, or metrics
- Use strong action verbs for existing tasks
- Maximum 4 bullet points
- Format as JSON array: ["Bullet 1", "Bullet 2", "Bullet 3"]

User's rough description: "${text}"

Convert ONLY the mentioned tasks into professional bullets:`;
    } else if (type === "skills") {
      systemPrompt = `You are a professional Resume Editor. Improve ONLY the skills mentioned in the input - do NOT add new skills that weren't mentioned.

CRITICAL INSTRUCTIONS:
- IMPORTANT: Respond in ${useLang === 'id' ? 'Indonesian (Bahasa Indonesia)' : 'English'} language
- ONLY improve the skills that are explicitly mentioned in the input
- DO NOT add skills that weren't in the original input
- Expand abbreviations (SEO → Search Engine Optimization)  
- Use professional terminology for existing skills
- Keep it concise - maximum 3-5 skills per category
- Maintain the same number of categories as input
- Return ONLY the improved skills text, NO explanations

Input skills: "${text}"

Improve ONLY the mentioned skills (don't add new ones):`;
    }

    // 3. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: systemPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500
    });

    let result = completion.choices[0]?.message?.content;
    console.log("AI Response:", result);

    // 4. Parse Result
    let finalData;
    
    if (type === "bullet") {
      try {
        if (result?.startsWith('[') && result?.endsWith(']')) {
          finalData = JSON.parse(result);
        } else {
          const jsonMatch = result?.match(/\[([\s\S]*?)\]/);
          if (jsonMatch) {
            finalData = JSON.parse(jsonMatch[0]);
          } else {
            // TypeScript fix here: explicitly type 'line' as string
            finalData = result?.split('\n')
              .filter((line: string) => line.trim())
              .map((line: string) => line.replace(/^[•\-\*\d\.]\s*/, '').trim())
              .filter((line: string) => line.length > 0) || [];
          }
        }
      } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback parsing
        finalData = result?.split('\n')
          .filter((line: string) => line.trim())
          .map((line: string) => line.replace(/^[•\-\*\d\.]\s*/, '').trim())
          .filter((line: string) => line.length > 0) || [];
      }
    } else if (type === "skills") {
      let cleanedResult = result?.trim() || text;
      
      // Bersihkan teks "basa-basi" AI
      cleanedResult = cleanedResult
        .replace(/^(Here are the formatted skills|Here is the formatted skills list).*?:/i, '')
        .replace(/Since the input.*$/gm, '')
        .replace(/The skills have been.*$/gm, '')
        .replace(/No significant changes.*$/gm, '')
        .replace(/Minor adjustments.*$/gm, '')
        .replace(/.*preserving.*structure.*$/gm, '')
        .replace(/.*professional terminology.*$/gm, '')
        .trim();
        
      // FIX UTAMA ADA DI SINI:
      // Tambahkan tipe (line: string) pada .filter() agar TypeScript tidak marah
      const lines = cleanedResult.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => 
          line.length > 0 && 
          !line.match(/^(Here|Since|The|Minor|No significant|However)/i) &&
          !line.includes('formatted') &&
          !line.includes('changes were made') &&
          !line.includes('readability')
        );
      
      finalData = lines.join('\n').trim() || text;
    } else {
      // Summary
      finalData = result?.trim() || text;
    }

    console.log("Final Data:", finalData);

    // Increment usage count setelah berhasil
    if (rateLimitCheck.userId) {
      await incrementDailyUsage(rateLimitCheck.userId);
    }

    return NextResponse.json({ 
      success: true, 
      data: finalData,
      usageInfo: {
        currentUsage: (rateLimitCheck.currentUsage || 0) + 1,
        maxUsage: rateLimitCheck.maxUsage,
        isPro: rateLimitCheck.isPro
      }
    });

  } catch (error: any) {
    console.error("CV Optimize Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "AI processing failed" 
    }, { status: 500 });
  }
}