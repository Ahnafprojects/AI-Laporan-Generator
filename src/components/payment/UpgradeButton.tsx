"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2 } from "lucide-react";

interface UpgradeButtonProps {
  plan?: "monthly" | "yearly";
}

export default function UpgradeButton({ plan = "monthly" }: UpgradeButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Load Script Midtrans Snap secara manual saat komponen dipasang
  useEffect(() => {
    const snapScript = "https://app.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    try {
      // 1. Minta Token Transaksi ke Backend kita dengan plan
      const res = await fetch("/api/payment/charge", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // 2. Munculkan Popup Midtrans
      // @ts-ignore (Snap ada di window global)
      window.snap.pay(data.snapToken, {
        onSuccess: function(result: any) {
          toast({ title: "Pembayaran Berhasil!", description: "Akun Anda kini PRO." });
          window.location.reload();
        },
        onPending: function(result: any) {
          toast({ title: "Menunggu Pembayaran", description: "Selesaikan pembayaran Anda." });
        },
        onError: function(result: any) {
          toast({ variant: "destructive", title: "Gagal", description: "Pembayaran gagal." });
        },
        onClose: function() {
          setLoading(false);
        }
      });

    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setLoading(false);
    }
  };

  const planDetails = {
    monthly: { price: "Rp 20.000", duration: "bulan" },
    yearly: { price: "Rp 180.000", duration: "tahun" }
  };

  return (
    <Button onClick={handleBuy} disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0 hover:from-yellow-600 hover:to-amber-700">
      {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Crown className="mr-2 h-4 w-4 fill-white" />}
      Upgrade PRO ({planDetails[plan].price})
    </Button>
  );
}