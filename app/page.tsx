import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, FileText, ShieldCheck, ArrowRight, Star, Mail, Wand2, Link2, QrCode, Image, FileImage, Eraser, PenTool, Download, Merge, BadgeCheck, Users, AlignLeft, Lock, Braces, Receipt, Type, Timer, ArrowRightLeft, GitCompare, FileType, Sparkles } from "lucide-react";
import Link from "next/link";
import ToolsSection from "@/components/home/ToolsSection";


export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* LIQUID BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-purple-400 top-0 left-0"></div>
        <div className="liquid-blob bg-yellow-300 top-0 right-0 animation-delay-2000"></div>
        <div className="liquid-blob bg-pink-400 bottom-0 left-20 animation-delay-4000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100/80 text-violet-700 border border-violet-200 backdrop-blur-md mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide">UNTUK MAHASISWA</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-10 duration-1000">
                Bikin Laporan Praktikum <br />
                <span className="text-gradient">Cuma 10 Detik.</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                Gak perlu lagi begadang mikirin kata-kata "Analisa" dan "Kesimpulan". Paste soal, paste kodingan, biarkan AI yang menyusun Laporan Praktikum berkualitas buat kamu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-in fade-in slide-in-from-bottom-14 duration-1000 delay-300">
                <Link href="/create">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-indigo-900 transition-all hover:scale-105">
                    <Wand2 className="mr-2 h-5 w-5" /> Mulai Generate
                  </Button>
                </Link>
                <div className="text-xs text-gray-400 flex items-center justify-center lg:justify-start mt-2 sm:mt-0">
                  *Format otomatis sesuai standar Laporan Praktikum
                </div>
              </div>
            </div>

            {/* Right Visual - Glass Card */}
            <div className="relative animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="glass-panel p-6 rounded-2xl relative">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100/50 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono ml-2">Laporan_Praktikum.docx</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-violet-50/50 rounded-lg border border-violet-100/50">
                    <div className="h-2 w-24 bg-violet-200/50 rounded mb-2"></div>
                    <div className="h-2 w-full bg-violet-200/50 rounded mb-1"></div>
                    <div className="h-2 w-2/3 bg-violet-200/50 rounded"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 bg-white/50 backdrop-blur rounded-full shadow-sm animate-bounce">
                      <ArrowRight className="h-4 w-4 text-violet-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg border border-white/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <div className="h-2.5 w-32 bg-gray-800 rounded"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-gray-200 rounded"></div>
                      <div className="h-2 w-full bg-gray-200 rounded"></div>
                      <div className="h-2 w-full bg-gray-200 rounded"></div>
                      <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-6 top-20 glass-card p-3 rounded-xl animate-bounce delay-700">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="absolute -left-4 bottom-10 glass-card p-3 rounded-xl animate-bounce delay-1000">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY USE THIS SECTION */}
      <section className="py-20 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-4">
              Kenapa Harus Pakai Ini?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Dibuat khusus untuk mahasiswa yang ingin produktif, bukan malas. Fokus ke ngodingnya, laporannya biar AI yang bantu rapikan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="h-16 w-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Format Profesional</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Otomatis layout, Cover page profesional, dan struktur laporan yang rapi dan terorganisir.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300 border-violet-200/50">
              <div className="h-16 w-16 mx-auto bg-violet-100 rounded-2xl flex items-center justify-center mb-6 text-violet-600 shadow-violet-200 shadow-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Super Cerdas</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Menggunakan Llama-3 70B yang paham konteks, OS, Jarkom, dan Web. Analisanya mendalam, bukan "kulitnya" doang.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="h-16 w-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privasi Aman</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Data kamu aman. Password dienkripsi, email diverifikasi. Kamu punya kendali penuh untuk hapus history laporanmu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Cara Kerja Magic-nya 🪄</h2>
              </div>

              <div className="grid md:grid-cols-5 gap-6 text-center">
                {[
                  { step: 1, title: "Login", desc: "Masuk ke menu Buat Laporan" },
                  { step: 2, title: "Paste Soal", desc: "Copy dari PDF Modul Praktikum" },
                  { step: 3, title: "Paste Kodingan", desc: "Jawaban coding kamu" },
                  { step: 4, title: "Generate", desc: "Klik & Tunggu ~10 detik" },
                  { step: 5, title: "Download", desc: "Review & Download Word" }
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="w-12 h-12 mx-auto bg-white shadow-md rounded-full flex items-center justify-center font-bold text-violet-600 mb-4 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                    {i !== 4 && <div className="hidden md:block absolute top-6 left-1/2 w-full h-[2px] bg-gray-200 -z-10 transform translate-x-1/2"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToolsSection />

    </div>
  );
}
