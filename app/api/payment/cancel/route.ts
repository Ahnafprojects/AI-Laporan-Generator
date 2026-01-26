import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Set isPro to false, but keep proExpiresAt so user still has access until expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPro: false, // Mark as cancelled but keep expiry date
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Subscription cancelled successfully" 
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}