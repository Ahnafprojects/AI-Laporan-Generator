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
          <Label>Email (Tidak bisa diubah)</Label>
          <Input value={user.email} disabled className="bg-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <Input name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label>NRP</Label>
          <Input name="nrp" defaultValue={user.nrp} required />
        </div>
        <div className="space-y-2">
          <Label>Kelas</Label>
          <Input name="kelas" defaultValue={user.kelas} required />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="mb-4 font-semibold text-gray-700">Data Institusi (Untuk Cover Laporan)</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Program Studi</Label>
            <Input name="prodi" defaultValue={user.prodi} className="text-xs uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Departemen</Label>
            <Input name="departemen" defaultValue={user.departemen} className="text-xs uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Institusi</Label>
            <Input name="institusi" defaultValue={user.institusi} className="text-xs uppercase" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
      </Button>
    </form>
  );
}