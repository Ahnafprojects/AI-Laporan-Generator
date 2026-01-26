"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload, Lightbulb, Coffee, Zap } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fun Facts & Motivasi untuk Loading
const LOADING_MESSAGES = [
  { icon: "💡", text: "Fun Fact: Python dinamakan dari serial komedi 'Monty Python's Flying Circus', bukan ular python!" },
  { icon: "☕", text: "Motivasi: 'Code never lies, comments sometimes do.' - Ron Jeffries" },
  { icon: "⚡", text: "Fun Fact: Bug pertama dalam komputer adalah seekor ngengat yang tersangkut di relay Harvard Mark II tahun 1947!" },
  { icon: "💻", text: "Motivasi: 'The best time to plant a tree was 20 years ago. The second best time is now.' - Coding edition: Mulai belajar sekarang!" },
  { icon: "🚀", text: "Fun Fact: Algoritma QuickSort diciptakan oleh Tony Hoare saat dia sedang belajar bahasa Rusia di Moscow!" },
  { icon: "📚", text: "Motivasi: 'Debugging is twice as hard as writing the code. So if you write the code as cleverly as possible, you are not smart enough to debug it.' - Brian Kernighan" },
  { icon: "🎯", text: "Fun Fact: Kata 'spam' untuk email sampah berasal dari sketch komedi Monty Python tentang daging kaleng Spam!" },
  { icon: "💪", text: "Motivasi: Setiap error adalah kesempatan untuk belajar. Setiap bug adalah tantangan untuk menjadi programmer yang lebih baik!" },
  { icon: "🌟", text: "Fun Fact: Kompiler pertama dunia ditulis oleh Grace Hopper pada tahun 1951. She's amazing!" },
  { icon: "🔥", text: "Motivasi: 'Programs must be written for people to read, and only incidentally for machines to execute.' - Harold Abelson" },
  { icon: "🎨", text: "Fun Fact: Bahasa C++ awalnya disebut 'C with Classes' sebelum berganti nama pada tahun 1983!" },
  { icon: "⭐", text: "Motivasi: Coding adalah seni memecah masalah besar menjadi potongan-potongan kecil yang bisa dipecahkan!" },
  { icon: "🧠", text: "Fun Fact: Stack Overflow diluncurkan tahun 2008 dan kini menjadi tempat 50+ juta programmer mencari jawaban!" },
  { icon: "💎", text: "Motivasi: 'Clean code always looks like it was written by someone who cares.' - Robert C. Martin" },
  { icon: "🎪", text: "Fun Fact: JavaScript dibuat hanya dalam 10 hari oleh Brendan Eich di Netscape tahun 1995!" }
];

// SCHEMA BARU (Tanpa Nama/NRP/Kelas)
const formSchema = z.object({
  title: z.string().min(3, "Judul wajib diisi"),
  subject: z.string().min(3, "Mata kuliah wajib diisi"),
  lecturer: z.string().min(3, "Dosen wajib diisi"),
  practiceDate: z.date(),
  labSheet: z.string().min(10, "Soal/Modul wajib diisi"),
  codeContent: z.string().default(""), // Default empty string
  // Image handled separately
});

export default function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null); // State untuk gambar
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [quota, setQuota] = useState<{used: number, remaining: number, maxDaily: number, canGenerate: boolean} | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      lecturer: "",
      labSheet: "",
      codeContent: "",
    },
  });

  // Cycling loading messages setiap 2 detik
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // Fetch quota saat component mount
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch('/api/quota');
        if (response.ok) {
          const data = await response.json();
          setQuota(data);
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error);
      }
    };
    
    fetchQuota();
  }, []);

  // Handle Image Upload -> Convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (quota && !quota.canGenerate) {
      toast({ 
        variant: "destructive", 
        title: "Kuota Habis!", 
        description: `Anda sudah mencapai batas maksimal ${quota.maxDaily} laporan per hari. ${quota.maxDaily === 3 ? 'Upgrade ke PRO untuk 50 laporan/hari atau c' : 'C'}oba lagi besok.` 
      });
      return;
    }

    setIsLoading(true);
    try {
      // Gabungkan data form + gambar
      const payload = {
        ...data,
        labImage: imageBase64, // Kirim gambar base64 ke API
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({ title: "Berhasil!", description: "Laporan siap." });
      router.push(`/preview/${result.reportId}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Buat Laporan Baru</CardTitle>
            {quota && (
              <div className={`text-sm px-3 py-1 rounded-full ${
                quota.remaining > 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                Kuota: {quota.remaining}/{quota.maxDaily} tersisa
              </div>
            )}
          </div>
          {quota && quota.remaining === 0 && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Kuota harian Anda sudah habis. Silakan coba lagi besok atau gunakan laporan yang sudah ada di riwayat.
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* INPUT METADATA PRAKTIKUM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Praktikum</FormLabel>
                    <FormControl><Input placeholder="Contoh: Modul 1 - Inheritance" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Kuliah</FormLabel>
                    <FormControl><Input placeholder="PBO" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lecturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosen Pengampu</FormLabel>
                    <FormControl><Input placeholder="Nama Dosen" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Tanggal Praktikum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* INPUT KONTEN UTAMA */}
            <div className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="labSheet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Soal / Modul (Wajib)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste teks soal di sini..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">2. Foto Soal (Opsional)</label>
                <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {imageBase64 && <span className="text-xs text-green-600">Foto terupload!</span>}
                </div>
                <p className="text-[10px] text-muted-foreground">Jika soal ada diagram/gambar, upload di sini agar AI bisa lihat.</p>
              </div>

              <FormField
                control={form.control}
                name="codeContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. Kode Program (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste kodingan jawabanmu (jika ada)..." className="font-mono text-xs min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || (quota ? !quota.canGenerate : false)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Sedang generate...
                </>
              ) : quota && !quota.canGenerate ? (
                "Kuota Harian Habis"
              ) : (
                "Generate Laporan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>

    {/* Loading Overlay dengan Fun Facts */}
    {isLoading && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Animated Loading Spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              {/* Progress Text */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Sedang Generate Laporan...</h3>
                <p className="text-sm text-muted-foreground">AI sedang menganalisis kode dan membuat laporan praktikum</p>
              </div>
              
              {/* Fun Facts / Motivasi */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {LOADING_MESSAGES[currentMessageIndex].icon === "💡" && <Lightbulb className="h-6 w-6 text-yellow-500" />}
                    {LOADING_MESSAGES[currentMessageIndex].icon === "☕" && <Coffee className="h-6 w-6 text-amber-600" />}
                    {LOADING_MESSAGES[currentMessageIndex].icon === "⚡" && <Zap className="h-6 w-6 text-blue-500" />}
                    {!['💡', '☕', '⚡'].includes(LOADING_MESSAGES[currentMessageIndex].icon) && 
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {LOADING_MESSAGES[currentMessageIndex].icon.replace(/\p{Emoji}/gu, '?')}
                      </div>
                    }
                  </span>
                  <p className="text-sm leading-relaxed">
                    {LOADING_MESSAGES[currentMessageIndex].text}
                  </p>
                </div>
              </div>
              
              {/* Progress Dots */}
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-blue-500 animate-pulse`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Biasanya memakan waktu 5-10 detik
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )}
  </>
  );
}