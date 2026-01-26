import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Manual PRO activation endpoint for testing
export async function POST(req: Request) {
  try {
    const { email, paymentId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Activate PRO for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await prisma.user.update({
      where: { email },
      data: {
        isPro: true,
        proExpiresAt: expiryDate,
      },
    });

    // Log transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: paymentId || `manual-${Date.now()}`,
        amount: 5036, // Amount paid
        status: "success",
        snapToken: "saweria-manual",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "PRO activation successful",
      expiresAt: expiryDate
    });

  } catch (error) {
    console.error("Manual activation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}