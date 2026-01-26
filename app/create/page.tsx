import ReportForm from "@/components/forms/ReportForm";

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