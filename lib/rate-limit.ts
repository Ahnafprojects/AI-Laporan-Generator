import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function checkDailyUsage(maxUsage?: number) {
  // Get user session
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return {
      allowed: false,
      error: "Unauthorized - Please login first",
      status: 401
    };
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return {
      allowed: false,
      error: "User not found",
      status: 404
    };
  }

  // Get today's date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today's usage
  const dailyUsage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    }
  });

  const currentUsage = dailyUsage?.usageCount || 0;

  // Status PRO aktif berdasarkan expiry date.
  const isPro = !!(user.proExpiresAt && user.proExpiresAt > new Date());
  const effectiveMaxUsage = maxUsage ?? (isPro ? 50 : 3);
  
  if (currentUsage >= effectiveMaxUsage) {
    return {
      allowed: false,
      error: `Daily AI usage limit reached (${effectiveMaxUsage}/day). Upgrade to Pro for unlimited access!`,
      status: 429,
      currentUsage,
      maxUsage: effectiveMaxUsage,
      isPro
    };
  }

  return {
    allowed: true,
    currentUsage,
    maxUsage: effectiveMaxUsage,
    isPro,
    userId: user.id
  };
}

export async function incrementDailyUsage(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Upsert daily usage record
    await prisma.dailyUsage.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today
        }
      },
      update: {
        usageCount: {
          increment: 1
        }
      },
      create: {
        userId: userId,
        date: today,
        usageCount: 1
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing daily usage:", error);
    return { success: false, error };
  }
}
