import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Token tidak valid", req.url));
    }

    // Cari user dengan token verifikasi
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: null, // Belum terverifikasi
      },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=Token tidak valid atau sudah digunakan", req.url));
    }

    // Update user menjadi terverifikasi
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Hapus token setelah digunakan
      },
    });

    // Redirect ke halaman login dengan pesan sukses
    return NextResponse.redirect(new URL("/login?verified=true", req.url));

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL("/login?error=Terjadi kesalahan sistem", req.url));
  }
}