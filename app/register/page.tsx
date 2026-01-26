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
        title: "Registrasi Berhasil! 🎉", 
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 py-8">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Daftar Akun Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            
            {/* BAGIAN 1: AKUN LOGIN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email PENS/Pribadi</label>
                <Input name="email" type="email" required placeholder="nama@it.student.pens.ac.id" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required placeholder="******" />
              </div>
            </div>

            {/* BAGIAN 2: DATA MAHASISWA */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input name="name" required placeholder="Contoh: Muhammad Ahnaf" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">NRP</label>
                <Input name="nrp" required placeholder="31246000XX" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kelas</label>
                <Input name="kelas" required placeholder="2 D4 IT C" />
              </div>
            </div>

            {/* BAGIAN 3: DATA INSTITUSI (UNTUK COVER) */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold mb-3 text-gray-700">Data Institusi (Otomatis Masuk ke Cover)</h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Program Studi</label>
                  <Input 
                    name="prodi" 
                    defaultValue="PROGRAM STUDI SARJANA TERAPAN TEKNIK INFORMATIKA" 
                    required 
                    className="bg-slate-50 uppercase text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Departemen</label>
                  <Input 
                    name="departemen" 
                    defaultValue="DEPARTEMEN TEKNIK INFORMATIKA DAN KOMPUTER" 
                    required 
                    className="bg-slate-50 uppercase text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Institusi</label>
                  <Input 
                    name="institusi" 
                    defaultValue="POLITEKNIK ELEKTRONIKA NEGERI SURABAYA" 
                    required 
                    className="bg-slate-50 uppercase text-xs"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Sedang Mendaftar..." : "Daftar Sekarang"}
            </Button>
            
            <p className="text-center text-sm pt-2">
              Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login disini</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}