"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

// Menerima data user dari server sebagai props
export default function ProfileForm({ user }: { user: any }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast({ title: "Sukses", description: "Data profil berhasil diperbarui." });
      router.refresh(); // Refresh agar data terbaru tampil
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-gray-700">Email (Tidak bisa diubah)</Label>
          <Input value={user.email} disabled className="bg-slate-100/50 border-gray-200 text-gray-500 cursor-not-allowed" />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Nama Lengkap</Label>
          <Input name="name" defaultValue={user.name} required className="bg-white/50 border-gray-200 focus:bg-white transition-all focus:ring-violet-500" />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">NRP</Label>
          <Input name="nrp" defaultValue={user.nrp} required className="bg-white/50 border-gray-200 focus:bg-white transition-all focus:ring-violet-500" />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Kelas</Label>
          <Input name="kelas" defaultValue={user.kelas} required className="bg-white/50 border-gray-200 focus:bg-white transition-all focus:ring-violet-500" />
        </div>
      </div>

      <div className="border-t border-gray-200/50 pt-4 mt-6">
        <h3 className="mb-4 font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
          Data Institusi (Untuk Cover Laporan)
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500 font-medium">Program Studi</Label>
            <Input name="prodi" defaultValue={user.prodi} className="text-xs uppercase bg-slate-50/50 border-gray-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500 font-medium">Departemen</Label>
            <Input name="departemen" defaultValue={user.departemen} className="text-xs uppercase bg-slate-50/50 border-gray-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500 font-medium">Institusi</Label>
            <Input name="institusi" defaultValue={user.institusi} className="text-xs uppercase bg-slate-50/50 border-gray-200" />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 transition-all rounded-lg">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}