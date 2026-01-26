import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportPreview from "@/components/preview/ReportPreview";

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  // 1. Await params terlebih dahulu (Next.js 15+)
  const { id } = await params;
  
  // 2. Fetch data langsung dari DB dengan include User data (Server Component)
  const report = await prisma.report.findUnique({
    where: {
      id: id,
    },
    include: { user: true }, // AMBIL DATA USER JUGA
  });

  // 2. Jika tidak ketemu, return 404
  if (!report) {
    return notFound();
  }

  // 3. Mapping data agar sesuai props component Preview
  const formattedReport = {
    ...report,
    studentName: report?.user.name,
    studentId: report?.user.nrp,
    class: report?.user.kelas,
    // Ambil data cover kustom dari user profile
    prodi: report?.user.prodi,
    departemen: report?.user.departemen,
    institusi: report?.user.institusi,
  };

  // 4. Render Client Component
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ReportPreview report={formattedReport} />
    </div>
  );
}