import Link from "next/link";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, FileText, ShieldCheck, ArrowRight, Star } from "lucide-react";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
            Untuk Mahasiswa
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl mb-6">
            Bikin Laporan Praktikum <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Cuma 10 Detik.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-8">
            Gak perlu lagi begadang mikirin kata-kata "Analisa" dan "Kesimpulan". 
            Paste soal, paste kodingan, biarkan AI yang menyusun Laporan Praktikum berkualitas buat kamu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/create">
                <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-blue-500/20">
                  <Zap className="mr-2 h-5 w-5 fill-current" /> Mulai Generate
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-blue-500/20">
                    Daftar Gratis Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    Masuk Akun
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <p className="mt-4 text-sm text-slate-500">
            *Format otomatis sesuai standar Laporan Praktikum.
          </p>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 w-[1000px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Kenapa Harus Pakai Ini?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Dibuat khusus untuk mahasiswa yang ingin produktif, bukan malas. Fokus ke ngodingnya, laporannya biar AI yang bantu rapikan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg bg-slate-50/50">
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Format Profesional</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Otomatis layout, Cover page profesional, dan struktur laporan yang rapi dan terorganisir.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-slate-50/50">
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle>AI Super Cerdas</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Menggunakan Llama-3 70B yang paham konteks, OS, Jarkom, dan Web. Analisanya mendalam, bukan "kulitnya" doang.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-slate-50/50">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Privasi Aman</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Data kamu aman. Password dienkripsi, email diverifikasi. Kamu punya kendali penuh untuk hapus history laporanmu.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Cara Kerja Magic-nya 🪄</h2>
              <ul className="space-y-4">
                {[
                  "Login & Masuk ke menu Buat Laporan.",
                  "Copy-Paste soal dari PDF Modul Praktikum.",
                  "Paste kodingan jawaban kamu.",
                  "Klik Generate & Tunggu ~10 detik.",
                  "Review hasilnya, lalu Download Word."
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                    <span className="text-lg">{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                 <Link href="/register">
                  <Button variant="link" className="text-blue-600 p-0 h-auto font-semibold">
                    Cobain sendiri sekarang <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Visualisasi Mockup Sederhana */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="text-xs text-slate-400 ml-2">Preview Laporan</div>
              </div>
              <div className="space-y-3 opacity-50">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-32 bg-slate-100 rounded border border-slate-300 flex items-center justify-center text-slate-400 text-sm">
                  [Code Block Area]
                </div>
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER / FOOTER */}
      
    </div>
  );
}