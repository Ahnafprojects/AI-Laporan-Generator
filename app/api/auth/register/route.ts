import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, password, name, nrp, kelas, prodi, departemen, institusi } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User sudah terdaftar dengan email ini" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create user with institutional data
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nrp,
        kelas,
        // Data institusi diambil dari input form register
        prodi: prodi || "PROGRAM STUDI SARJANA TERAPAN TEKNIK INFORMATIKA", 
        departemen: departemen || "DEPARTEMEN TEKNIK INFORMATIKA DAN KOMPUTER",
        institusi: institusi || "POLITEKNIK ELEKTRONIKA NEGERI SURABAYA",
        verificationToken: verificationToken, // Token untuk verifikasi
        emailVerified: null, // Belum verifikasi
      },
    });

    // Send welcome email (non-blocking)
    try {
      const emailResult = await sendWelcomeEmail(email, name, verificationToken);
      if (!emailResult.success) {
        console.error('Failed to send welcome email (non-critical):', emailResult.error);
      } else {
        console.log('Welcome email sent successfully');
      }
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError);
      // Registration continues even if email fails
    }

    return NextResponse.json({
      message: "User berhasil dibuat. Silakan cek email untuk verifikasi akun.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}