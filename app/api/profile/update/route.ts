import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, nrp, kelas, prodi, departemen, institusi } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        nrp,
        kelas,
        prodi,
        departemen,
        institusi,
      },
    });

    return NextResponse.json({ success: true, message: "Profil berhasil diupdate!" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update profil" }, { status: 500 });
  }
}