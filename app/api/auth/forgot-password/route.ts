import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan dalam sistem" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: resetToken, // Reuse existing field
        // We can add expiresAt field later if needed
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, resetToken);

    return NextResponse.json({
      message: "Email reset password berhasil dikirim",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim email reset password" },
      { status: 500 }
    );
  }
}