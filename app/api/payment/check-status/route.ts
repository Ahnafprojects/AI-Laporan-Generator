import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Check user PRO status
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const emailFromQuery = searchParams.get('email');
    const emailFromSession = session?.user?.email || null;
    const email = (emailFromQuery || emailFromSession || "").toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Jika user login, batasi agar tidak bisa cek email user lain.
    if (emailFromSession && emailFromQuery && emailFromSession.toLowerCase() !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        isPro: true,
        proExpiresAt: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isProActive = user.proExpiresAt && new Date(user.proExpiresAt) > new Date();

    return NextResponse.json({
      email: user.email,
      isPro: user.isPro,
      proExpiresAt: user.proExpiresAt,
      isProActive,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
