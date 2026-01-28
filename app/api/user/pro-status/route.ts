import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isPro: true, proExpiresAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // PRO is active if proExpiresAt exists and is in future (regardless of isPro flag)
    // This allows cancelled users to keep access until expiry
    const isProActive = user.proExpiresAt && new Date(user.proExpiresAt) > new Date();

    return NextResponse.json({ 
      isProActive: !!isProActive,
      proExpiresAt: user.proExpiresAt,
      isPro: user.isPro // Include isPro flag for additional context
    });
  } catch (error) {
    console.error("PRO status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}