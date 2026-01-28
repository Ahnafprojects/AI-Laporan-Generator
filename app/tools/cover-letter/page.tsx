"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Download, Eye, User, GraduationCap, BookOpen, Building, Target, Star, Briefcase, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function CoverLetterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ currentUsage: 0, maxUsage: 5, isPro: false });
  const { toast } = useToast();
  
  // State form
  const [formData, setFormData] = useState({
    name: "", 
    university: "", 
    major: "",
    position: "", 
    company: "", 
    skills: "", 
    experience: "",
    language: "indonesian"
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLanguageChange = (value: string) => setFormData({ ...formData, language: value });

  const handleGenerate = async () => {
    if (!formData.name || !formData.position || !formData.company) {
      alert("Mohon lengkapi minimal Nama, Posisi, dan Perusahaan");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.content) {
        setResult(data.content);
        setShowPreview(true);
        
        if (data.usageInfo) {
          setUsageInfo(data.usageInfo);
          if (!data.usageInfo.isPro) {
            toast({
              title: "Cover Letter Berhasil Dibuat",
              description: `Penggunaan AI hari ini: ${data.usageInfo.currentUsage}/${data.usageInfo.maxUsage}`,
            });
          }
        }
      } else {
        if (data.error?.includes('Daily AI usage limit')) {
          alert(`Batas Penggunaan AI Tercapai\n\n${data.error}\n\nUpgrade ke PRO untuk akses unlimited AI`);
        } else {
          alert(`Error: ${data.error || 'Failed to generate'}`);
        }
      }
    } catch (error) {
      console.error("Cover letter generation error:", error);
      alert("Error: Gagal membuat cover letter. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "✅ Berhasil!",
        description: "Cover letter berhasil disalin ke clipboard",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Gagal!", 
        description: "Gagal menyalin teks. Silakan coba lagi.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleExportWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Cover Letter</title></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + "<div style='font-family: Times New Roman; font-size: 12pt; line-height: 1.5;'>" + result.replace(/\n/g, "<br>") + "</div>" + footer;
    
    const blob = new Blob([sourceHTML], { type: "application/vnd.ms-word" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cover_Letter_${formData.name.replace(/\s+/g, "_")}_${formData.company.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Cover Letter Generator
          </h1>
          
          {/* AI Usage Indicator */}
          <div className="text-xs bg-gray-100 px-3 py-2 rounded-full border">
            {usageInfo.isPro ? (
              <span className="text-purple-600 font-bold">PRO: Unlimited</span>
            ) : (
              <span className="text-gray-600">
                AI Today: <b>{usageInfo.currentUsage}/{usageInfo.maxUsage}</b>
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-lg">Buat surat lamaran yang mengesankan HRD dalam hitungan detik</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Input */}
        <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl p-6 rounded-xl border border-white/40 shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Pribadi</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Nama Lengkap *
                </label>
                <Input name="name" placeholder="Ahmad Rizki Pratama" onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  Asal Universitas
                </label>
                <Input name="university" placeholder="Universitas Indonesia" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500" />
                Jurusan/Program Studi
              </label>
              <Input name="major" placeholder="Teknik Informatika" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  Posisi yang Dilamar *
                </label>
                <Input name="position" placeholder="Frontend Developer Intern" onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                  <Building className="h-4 w-4 text-red-500" />
                  Nama Perusahaan *
                </label>
                <Input name="company" placeholder="PT. Teknologi Maju Bersama" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                Bahasa Surat
              </label>
              <Select value={formData.language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indonesian">Bahasa Indonesia</SelectItem>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Keahlian Utama
              </label>
              <Textarea 
                name="skills" 
                placeholder="React, Next.js, TypeScript, Komunikasi yang baik, Teamwork" 
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-500" />
                Pengalaman Relevan
              </label>
              <Textarea 
                name="experience" 
                placeholder="Contoh: Membuat website e-commerce untuk tugas akhir, menjadi sekretaris di organisasi mahasiswa selama 1 tahun, mengikuti bootcamp programming 6 bulan. *Hindari angka palsu, tulis pengalaman asli*" 
                onChange={handleChange}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Tip: Tulis pengalaman nyata Anda. AI akan memformat dengan bahasa profesional tanpa menambah angka palsu.</p>
            </div>
            
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 border rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-xl">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Preview Cover Letter
            </h3>
            {result && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportWord}>
                  <Download className="h-4 w-4 mr-2" /> Export Word
                </Button>
              </div>
            )}
          </div>
          
          <div className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
            {result ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif text-sm" style={{fontFamily: 'Times New Roman, serif'}}>
                  {result}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Cover Letter Preview</p>
                <p className="text-gray-400 text-sm">Isi form dan klik Generate untuk melihat hasil</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50/80 to-white/60 backdrop-blur-xl p-6 rounded-xl border border-blue-200/50 shadow-xl">
          <h3 className="font-bold text-blue-800 mb-3">Tips Cover Letter yang Mengesankan:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Research perusahaan</strong> - Sebutkan spesifik kenapa tertarik dengan perusahaan tersebut</li>
            <li>• <strong>Customize per posisi</strong> - Sesuaikan skill yang disebutkan dengan job description</li>
            <li>• <strong>Show enthusiasm</strong> - Tunjukkan genuine interest, bukan copy-paste template</li>
            <li>• <strong>Be authentic</strong> - Gunakan pencapaian nyata, bukan yang dibuat-buat</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50/80 to-white/60 backdrop-blur-xl p-6 rounded-xl border border-amber-200/50 shadow-xl">
          <h3 className="font-bold text-amber-800 mb-3">Penting untuk Diperhatikan:</h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• <strong>Review hasil AI</strong> - Selalu periksa dan edit sesuai kondisi nyata Anda</li>
            <li>• <strong>Jangan bohong</strong> - Ganti angka/metrik yang tidak sesuai dengan pengalaman asli</li>
            <li>• <strong>Sesuaikan pengalaman</strong> - Pastikan semua klaim bisa dibuktikan saat interview</li>
            <li>• <strong>Personalisasi</strong> - Tambahkan detail spesifik tentang perusahaan target</li>
          </ul>
        </div>
      </div>
      <Toaster />
    </div>
  );
}