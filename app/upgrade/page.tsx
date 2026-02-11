"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Check, Zap, Gift, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redeemCode, setRedeemCode] = useState("");
  const [isCodeApplied, setIsCodeApplied] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatusMsg, setPaymentStatusMsg] = useState("");
  
  // Loading session
  if (status === "loading") {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  // Harga dan diskon
  const ORIGINAL_MONTHLY = 20000;
  const ORIGINAL_YEARLY = 180000;
  const DISCOUNTED_MONTHLY = 5000; // 75% discount
  const DISCOUNT_PERCENTAGE = 0.75; // 75%
  const DISCOUNTED_YEARLY = ORIGINAL_YEARLY * (1 - DISCOUNT_PERCENTAGE); // 180k -> 45k
  const VALID_REDEEM_CODE = "TEST15K";
  
  const monthlyPrice = isCodeApplied ? DISCOUNTED_MONTHLY : ORIGINAL_MONTHLY;
  const yearlyPrice = isCodeApplied ? DISCOUNTED_YEARLY : ORIGINAL_YEARLY;
  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;
  
  const handleApplyCode = () => {
    if (redeemCode.toUpperCase() === VALID_REDEEM_CODE) {
      setIsCodeApplied(true);
    } else {
      alert("Kode redeem tidak valid!");
      setRedeemCode("");
    }
  };
  
  const handleRemoveCode = () => {
    setIsCodeApplied(false);
    setRedeemCode("");
  };
  
  const SAWERIA_URL = "https://saweria.co/smartlabseepis";

  const handleCheckPayment = async () => {
    if (!session?.user?.email) return;
    setIsCheckingPayment(true);
    setPaymentStatusMsg("");

    try {
      const res = await fetch(`/api/payment/check-status?email=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengecek status pembayaran");

      if (data.isProActive) {
        setPaymentStatusMsg("Pembayaran terdeteksi. Akun kamu sudah PRO.");
        router.refresh();
      } else {
        setPaymentStatusMsg("Belum terdeteksi. Tunggu 1-5 menit lalu cek lagi.");
      }
    } catch (error: any) {
      setPaymentStatusMsg(error.message || "Terjadi error saat mengecek status.");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const UpgradeButtonComponent = ({ price }: { price: number }) => (
    <div className="flex flex-col gap-3">
      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0 w-full">
        <Link href={SAWERIA_URL} target="_blank">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade PRO (via Saweria)
        </Link>
      </Button>

      <Button onClick={handleCheckPayment} variant="outline" className="w-full" disabled={isCheckingPayment}>
        {isCheckingPayment ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengecek status...
          </>
        ) : (
          "Saya sudah bayar, cek status"
        )}
      </Button>

      {paymentStatusMsg && (
        <div className="text-xs rounded border bg-white p-2 text-slate-600">
          {paymentStatusMsg}
        </div>
      )}
      
      {/* Instruksi Penting */}
      <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded border border-slate-200">
        <p className="font-semibold text-red-500 mb-1">PENTING:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Klik tombol di atas.</li>
          <li>Isi nominal <strong>{formatPrice(price)}</strong>.</li>
          <li>
            Di kolom <strong>Pesan/Message</strong>, WAJIB tulis email login kamu: <br/>
            <span className="font-mono bg-slate-200 px-1 rounded select-all">
              {session?.user?.email || "email-kamu@contoh.com"}
            </span>
          </li>
          <li>Akun PRO aktif otomatis dalam 1-5 menit.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container py-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Upgrade ke PRO</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dapatkan akses unlimited untuk menggenerate laporan praktikum tanpa batas!
        </p>
      </div>

      {/* Redeem Code Section */}
      <div className="max-w-md mx-auto mb-8 bg-gradient-to-br from-blue-50/80 to-purple-50/60 backdrop-blur-xl p-4 rounded-xl border border-white/40 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-blue-700">Punya Kode Diskon?</span>
        </div>
        
        {!isCodeApplied ? (
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan kode diskon"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="text-sm"
            />
            <Button 
              onClick={handleApplyCode}
              variant="outline" 
              size="sm"
              disabled={!redeemCode.trim()}
            >
              Apply
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-100 p-3 rounded border border-green-200">
            <div className="text-sm text-green-700">
              <span className="font-medium">✅ Kode diskon diterapkan!</span>
              <br />
              <span>Monthly: Rp 20k→5k, Yearly: Rp 180k→45k</span>
            </div>
            <Button 
              onClick={handleRemoveCode}
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              Hapus
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* FREE PLAN */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/70 backdrop-blur-2xl border border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Gratis
            </CardTitle>
            <div className="text-3xl font-bold">Free</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>3 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
          </CardContent>
        </Card>

        {/* PRO MONTHLY PLAN */}
        <Card className="border-2 border-blue-300 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              POPULAR
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-blue-500" />
              PRO Monthly
            </CardTitle>
            <div className="text-center">
              {isCodeApplied && (
                <div className="text-lg text-gray-500 line-through">Rp 20.000</div>
              )}
              <div className="text-3xl font-bold">{formatPrice(monthlyPrice)}</div>
              <div className="text-sm text-muted-foreground">per bulan</div>
              {isCodeApplied && (
                <div className="text-sm text-green-600 font-medium">Hemat Rp 15.000!</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">50 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">No Ads</span>
            </div>
            
            <div className="pt-4">
              <UpgradeButtonComponent price={monthlyPrice} />
            </div>
          </CardContent>
        </Card>

        {/* PRO YEARLY PLAN */}
        <Card className="border-2 border-yellow-300 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              {isCodeApplied ? "SUPER DEAL!" : "BEST VALUE"}
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              PRO Yearly
            </CardTitle>
            <div className="text-center">
              {isCodeApplied && (
                <div className="text-lg text-gray-500 line-through">Rp 180.000</div>
              )}
              <div className="text-3xl font-bold">{formatPrice(yearlyPrice)}</div>
              <div className="text-sm text-muted-foreground">
                {isCodeApplied ? "sekali bayar" : "per tahun"}
              </div>
              {isCodeApplied ? (
                <div className="text-sm text-green-600 font-medium">Hemat Rp 135.000! (75% off)</div>
              ) : (
                <div className="text-sm text-green-600 font-medium">Hemat Rp 60.000!</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">50 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">
                {isCodeApplied ? "MEGA DISCOUNT!" : "25% Discount"}
              </span>
            </div>
            
            <div className="pt-4">
              <UpgradeButtonComponent price={yearlyPrice} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Pembayaran aman melalui Saweria. Akun PRO aktif otomatis setelah donasi.
        </p>
      </div>
    </div>
  );
}
