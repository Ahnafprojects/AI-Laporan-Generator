import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // 1. Ambil data user beserta password hash-nya
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // 2. Cek password lama benar atau tidak
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password lama salah!" }, { status: 400 });
    }

    // 3. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Password berhasil diganti!" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal ganti password" }, { status: 500 });
  }
}