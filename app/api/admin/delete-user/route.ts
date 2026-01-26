import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  const session = await getServerSession();
  
  // 1. SECURITY CHECK: Cuma Admin yang boleh akses
  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden: You are not Admin" }, { status: 403 });
  }

  const { id } = await req.json();

  try {
    // 2. Hapus dulu semua laporan milik user ini (biar bersih)
    await prisma.report.deleteMany({
      where: { userId: id },
    });

    // 3. Baru hapus usernya
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}