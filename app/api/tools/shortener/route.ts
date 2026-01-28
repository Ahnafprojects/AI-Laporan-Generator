import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, error: "URL wajib diisi" }, { status: 400 });
    }

    // Validasi & normalisasi URL
    let validUrl = url.trim();
    
    // Auto-add https:// jika tidak ada protocol
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    // Validasi URL format
    try {
      const urlObj = new URL(validUrl);
      // Pastikan ada hostname
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        return NextResponse.json({ success: false, error: "URL tidak valid" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ success: false, error: "Format URL tidak valid" }, { status: 400 });
    }

    // --- PAKAI TINYURL (Paling Stabil & Gratis) ---
    const tinyUrlApi = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(validUrl)}`;
    
    const response = await fetch(tinyUrlApi, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SmartLabs/1.0)'
      }
    });
    
    if (!response.ok) {
      console.error('TinyURL error:', response.status, response.statusText);
      return NextResponse.json({ 
        success: false, 
        error: "Service sedang sibuk, coba lagi" 
      }, { status: 500 });
    }

    const shortUrl = await response.text();
    
    // TinyURL return plain text, bukan JSON
    if (!shortUrl || !shortUrl.startsWith('http')) {
      console.error('Invalid TinyURL response:', shortUrl);
      return NextResponse.json({ 
        success: false, 
        error: "Gagal generate link pendek" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      original: validUrl,
      short: shortUrl.trim()
    });

  } catch (error) {
    console.error("Shortener Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Terjadi kesalahan saat memproses link" 
    }, { status: 500 });
  }
}