import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Manual PRO activation endpoint for testing
export async function POST(req: Request) {
  try {
    const { email, paymentId, plan = 'monthly' } = await req.json();

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

    // Calculate expiry date based on plan
    const expiryDate = new Date();
    if (plan === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 365 days
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days (monthly)
    }

    await prisma.user.update({
      where: { email },
      data: {
        isPro: true,
        proExpiresAt: expiryDate,
      },
    });

    // Log transaction with appropriate amount
    const amount = plan === 'yearly' ? 180000 : 20000; // Default amounts
    await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId: paymentId || `manual-${plan}-${Date.now()}`,
        amount: amount,
        status: "success",
        snapToken: `admin-${plan}`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `PRO ${plan} activation successful`,
      expiresAt: expiryDate,
      plan
    });

  } catch (error) {
    console.error("Manual activation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}