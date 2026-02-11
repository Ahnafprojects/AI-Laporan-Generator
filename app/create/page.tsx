import dynamic from "next/dynamic";

const ReportForm = dynamic(() => import("@/components/forms/ReportForm"), {
  loading: () => (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white/70 p-8">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 mb-4" />
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded bg-gray-100" />
        <div className="h-10 animate-pulse rounded bg-gray-100" />
        <div className="h-10 animate-pulse rounded bg-gray-100" />
        <div className="h-32 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  ),
});

export default function CreatePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Input Data Praktikum
        </h1>
        <p className="text-muted-foreground mt-2">
          Pastikan kode yang dimasukkan sudah benar dan bisa dijalankan.
        </p>
      </div>
      
      <ReportForm />
    </div>
  );
}
