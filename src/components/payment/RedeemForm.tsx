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
    <div className="mt-4 p-4 border border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Ticket className="h-4 w-4 text-blue-500" />
        Punya Kode Voucher?
      </h3>
      <form onSubmit={handleRedeem} className="flex gap-2">
        <Input 
          placeholder="Masukkan kode..." 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          className="bg-white dark:bg-slate-950"
        />
        <Button type="submit" variant="secondary" disabled={loading || !code}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Klaim"}
        </Button>
      </form>
    </div>
  );
}