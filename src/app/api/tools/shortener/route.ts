import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, error: "URL wajib diisi" }, { status: 400 });
    }

    // Validasi URL format
    let validUrl = url.trim();
    
    // Auto-add https:// jika tidak ada protocol
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    // Validasi URL dengan URL constructor
    try {
      new URL(validUrl);
    } catch {
      return NextResponse.json({ success: false, error: "URL tidak valid" }, { status: 400 });
    }

    // Panggil API TinyURL (Gratis & Stabil)
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(validUrl)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'SmartLabs/1.0'
      }
    });
    
    if (!response.ok) {
      console.error('TinyURL API error:', response.status, response.statusText);
      return NextResponse.json({ success: false, error: "Gagal memendekkan link" }, { status: 500 });
    }

    const shortUrl = await response.text();
    
    // Check if response is valid
    if (!shortUrl || shortUrl.includes('Error') || !shortUrl.startsWith('http')) {
      return NextResponse.json({ success: false, error: "Gagal memendekkan link" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      original: validUrl,
      short: shortUrl.trim()
    });

  } catch (error) {
    console.error('Shortener error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Terjadi kesalahan saat memproses link" 
    }, { status: 500 });
  }
}