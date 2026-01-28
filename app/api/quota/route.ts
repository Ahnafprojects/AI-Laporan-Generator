import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 1. Cek Status PRO User - based on expiry date, not isPro flag
    const isProActive = user.proExpiresAt && new Date(user.proExpiresAt) > new Date();

    // 2. Tentukan Limit berdasarkan status PRO
    const maxDaily = isProActive ? 50 : 3; // Pro 50, Free 3

    // 3. Hitung usage hari ini dari DailyUsage table (tidak berkurang meski laporan dihapus)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyUsage = await prisma.dailyUsage.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    // Jika belum ada record hari ini, berarti usage = 0
    const usageCount = dailyUsage?.usageCount || 0;
    const remaining = Math.max(0, maxDaily - usageCount);

    return NextResponse.json({
      used: usageCount,
      remaining: remaining,
      maxDaily: maxDaily,
      canGenerate: remaining > 0,
    });

  } catch (error) {
    console.error("Get quota error:", error);
    return NextResponse.json(
      { error: "Failed to get quota" },
      { status: 500 }
    );
  }
}