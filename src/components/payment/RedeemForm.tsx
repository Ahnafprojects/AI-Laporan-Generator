"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RedeemForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    try {
      const res = await fetch("/api/payment/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast({ title: "Berhasil!", description: data.message });
      setCode(""); // Reset input
      router.refresh(); // Refresh halaman biar status berubah

      // Opsional: Reload window biar limit di frontend langsung update
      setTimeout(() => window.location.reload(), 1000);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm p-5 rounded-xl border border-white/40 shadow-sm mt-4">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-800">
        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
          <Ticket className="h-4 w-4" />
        </div>
        Punya Kode Voucher untuk Kuota?
      </h3>
      <form onSubmit={handleRedeem} className="flex gap-2">
        <Input
          placeholder="Masukkan kode voucher..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-white/70 border-gray-200 focus:bg-white transition-all h-10"
        />
        <Button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white h-10 px-4 rounded-lg" disabled={loading || !code}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Klaim"}
        </Button>
      </form>
    </div>
  );
}