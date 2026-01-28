"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast({
        title: "Registrasi Berhasil!",
        description: "Akun berhasil dibuat. Cek email untuk konfirmasi!"
      });
      router.push("/login");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Daftar", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-10">

      {/* LIQUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-pink-400 top-20 left-10 opacity-20"></div>
        <div className="liquid-blob bg-violet-400 bottom-20 right-10 animation-delay-2000 opacity-20"></div>
      </div>

      <div className="w-full max-w-xl p-4 relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              SmartLabs
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="text-gray-500 mt-2">Isi data sekali, generate laporan berkali-kali.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          {/* Decorative gradients inside card */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-pink-500"></div>

          <form onSubmit={onSubmit} className="space-y-5">

            {/* BAGIAN 1: AKUN LOGIN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input name="email" type="email" required placeholder="nama@email.com" className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input name="password" type="password" required placeholder="••••••••" className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11" />
              </div>
            </div>

            {/* BAGIAN 2: DATA MAHASISWA */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <Input name="name" required placeholder="Contoh: John Doe" className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">NIM / ID</label>
                <Input name="nrp" required placeholder="12345678" className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kelas / Divisi</label>
                <Input name="kelas" required placeholder="Contoh: IF-A / Marketing" className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11" />
              </div>
            </div>

            {/* BAGIAN 3: DATA INSTITUSI (UNTUK COVER) */}
            <div className="pt-4 mt-4 border-t border-gray-200/50">
              <h3 className="text-xs font-bold mb-3 text-violet-600 uppercase tracking-wider bg-violet-50 inline-block px-2 py-1 rounded">Data Institusi (Auto-Cover)</h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Program Studi</label>
                  <Input
                    name="prodi"
                    placeholder="Contoh: Teknik Informatika"
                    required
                    className="bg-gray-50/50 uppercase text-xs border-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Departemen / Fakultas</label>
                  <Input
                    name="departemen"
                    placeholder="Contoh: Fakultas Teknik"
                    required
                    className="bg-gray-50/50 uppercase text-xs border-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Institusi / Universitas</label>
                  <Input
                    name="institusi"
                    placeholder="Contoh: Universitas Teknologi"
                    required
                    className="bg-gray-50/50 uppercase text-xs border-gray-200"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 mt-4 text-base rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={loading}>
              {loading ? "Sedang Mendaftar..." : "Daftar Sekarang"}
            </Button>

            <p className="text-center text-sm pt-2 text-gray-600">
              Sudah punya akun? <Link href="/login" className="text-violet-600 font-bold hover:underline">Login disini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}