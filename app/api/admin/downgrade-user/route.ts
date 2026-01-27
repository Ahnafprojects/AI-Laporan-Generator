import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId && !email) {
      return NextResponse.json({ error: "userId or email required" }, { status: 400 });
    }

    // Downgrade user ke FREE
    const user = await prisma.user.update({
      where: userId ? { id: userId } : { email },
      data: {
        isPro: false,
        proExpiresAt: null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "User downgraded to FREE",
      user: {
        id: user.id,
        email: user.email,
        isPro: user.isPro,
        proExpiresAt: user.proExpiresAt
      }
    });

  } catch (error) {
    console.error("Downgrade user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}