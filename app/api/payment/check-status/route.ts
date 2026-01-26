import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Check user PRO status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
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