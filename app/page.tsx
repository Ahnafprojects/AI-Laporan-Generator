import Link from "next/link";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, FileText, ShieldCheck, ArrowRight, Star, Mail, Wand2, Link2, QrCode, Image, FileImage, Eraser, PenTool, Download, Merge, BadgeCheck, Users } from "lucide-react";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:bg-slate-950">
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
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-xl border border-white/40">
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Format Profesional</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Otomatis layout, Cover page profesional, dan struktur laporan yang rapi dan terorganisir.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/80 to-yellow-50/50 backdrop-blur-xl border border-white/40">
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle>AI Super Cerdas</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Menggunakan Llama-3 70B yang paham konteks, OS, Jarkom, dan Web. Analisanya mendalam, bukan "kulitnya" doang.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/80 to-green-50/50 backdrop-blur-xl border border-white/40">
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
            <div className="flex-1 bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/50 rotate-2 hover:rotate-0 transition-transform duration-500">
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

      {/* TOOLS SECTION */}
      <section className="py-20 bg-gradient-to-br from-purple-50/70 via-blue-50/50 to-pink-50/70 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Tools Tambahan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Tidak hanya laporan praktikum, kami juga punya tools lain untuk membantu perjalanan akademik dan karier kamu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Cover Letter Tool */}
            <Link href="/tools/cover-letter" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mail className="h-24 w-24 text-blue-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 w-fit">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Surat Sakti
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Cover Letter Generator</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Bikin HRD jatuh cinta pada pandangan pertama lewat kata-kata. Generate cover letter yang profesional dan menarik untuk lamaran kerja.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  Buat Cover Letter <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* CV Maker Tool */}
            <Link href="/tools/cv-builder" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 className="h-24 w-24 text-purple-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-3 w-fit">
                  <Wand2 className="h-6 w-6 text-purple-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  CV Magic
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">CV Bullet Point Generator</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Ubah pengalaman "biasa aja" jadi kalimat profesional yang lolos sistem ATS HRD. Perfect untuk mahasiswa yang mau apply internship/kerja.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-purple-600">
                  Sulap CV Kamu <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Link Shortener & QR Tool */}
            <Link href="/tools/link-shortener" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <QrCode className="h-24 w-24 text-green-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-100 p-3 w-fit">
                  <Link2 className="h-6 w-6 text-green-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Link Shortener & QR
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">URL Shortener & QR Generator</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Pendekkan link ribet jadi simpel & generate QR Code HD otomatis. Cocok buat banner event & poster.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-green-600">
                  Coba Sekarang <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Image to PDF Tool */}
            <Link href="/tools/image-to-pdf" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="h-24 w-24 text-red-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-red-100 p-3 w-fit">
                  <Image className="h-6 w-6 text-red-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  JPG to PDF
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Image to PDF Converter</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Scan tugas tulis tangan atau gabungkan foto KTP & Ijazah jadi satu file PDF. Privasi aman.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-red-600">
                  Convert Sekarang <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Image Compressor Tool */}
            <Link href="/tools/image-compressor" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileImage className="h-24 w-24 text-orange-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-orange-100 p-3 w-fit">
                  <FileImage className="h-6 w-6 text-orange-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Image Compressor
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Compress & Optimize Images</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Kecilkan ukuran foto tanpa hilang kualitas. Perfect untuk upload berkas lamaran atau website.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-orange-600">
                  Compress Sekarang <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* AI Background Remover Tool */}
            <Link href="/tools/remove-bg" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Eraser className="h-24 w-24 text-pink-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-pink-100 p-3 w-fit">
                  <Eraser className="h-6 w-6 text-pink-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                  AI Background Remover
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Remove & Replace Background</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Hapus background foto otomatis & ganti warna Merah/Biru buat pas foto KTP/Wisuda. Gratis & HD.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-pink-600">
                  Coba Sekarang <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Digital Signature Tool */}
            <Link href="/tools/signature" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PenTool className="h-24 w-24 text-blue-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 w-fit">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Tanda Tangan Digital
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Digital Signature Maker</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Bikin tanda tangan digital background transparan. Tinggal tempel di Word/PDF tanpa perlu scan.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  Mulai Gambar <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* PDF Merger Tool */}
            <Link href="/tools/pdf-merger" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Merge className="h-24 w-24 text-purple-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-3 w-fit">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  PDF Merger
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Combine PDF Files</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Satukan file Cover, Bab 1-5, dan Lampiran jadi satu file PDF utuh. Urutan bisa diatur.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-purple-600">
                  Gabungkan File <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Certificate Generator Tool */}
            <Link href="/tools/certificate" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BadgeCheck className="h-24 w-24 text-yellow-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-yellow-100 p-3 w-fit">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                  E-Certificate Generator
                </h3>
                
                <p className="text-xs text-gray-400 mb-3">Bulk Certificate Maker</p>
                
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  Bikin 500+ sertifikat event otomatis dalam sekali klik. Tinggal upload template & list nama.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-yellow-600">
                  Buat Sertifikat <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            {/* <p className="text-sm text-slate-500 mb-4">
              <strong>Coming Soon:</strong> Resume Builder, LinkedIn Optimizer, Interview Prep
            </p> */}
            {!session && (
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Daftar Gratis untuk Akses Semua Tools
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* DISCLAIMER / FOOTER */}
      
    </div>
  );
}