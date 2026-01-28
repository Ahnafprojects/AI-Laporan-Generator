import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, message, email } = body;

    // Validasi input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1-5" }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message tidak boleh kosong" }, { status: 400 });
    }

    // Cek session untuk mendapatkan userId (opsional)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ? 
      await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }).then(u => u?.id) 
      : null;

    // Simpan feedback ke database
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        message: message.trim(),
        email: email?.trim() || null,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}