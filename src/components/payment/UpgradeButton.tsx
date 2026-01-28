"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, ExternalLink, Gift } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UpgradeButton() {
  const { data: session } = useSession();
  const [redeemCode, setRedeemCode] = useState("");
  const [isCodeApplied, setIsCodeApplied] = useState(false);
  
  // Harga dan diskon
  const ORIGINAL_PRICE = 20000;
  const DISCOUNTED_PRICE = 5000;
  const DISCOUNT_AMOUNT = ORIGINAL_PRICE - DISCOUNTED_PRICE;
  const VALID_REDEEM_CODE = "TEST15K"; // Kode redeem untuk testing
  
  const currentPrice = isCodeApplied ? DISCOUNTED_PRICE : ORIGINAL_PRICE;
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
  
  // Ganti dengan Link Saweria kamu
  const SAWERIA_URL = "https://saweria.co/smartlabseepis"; 

  return (
    <div className="flex flex-col gap-3">
      {/* Redeem Code Section */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Punya Kode Diskon?</span>
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
          <div className="flex items-center justify-between bg-green-100 p-2 rounded border border-green-200">
            <div className="text-sm text-green-700">
              <span className="font-medium">Kode "TEST15K" diterapkan!</span>
              <br />
              <span>Hemat {formatPrice(DISCOUNT_AMOUNT)}</span>
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

      {/* Price Display */}
      <div className="text-center">
        {isCodeApplied && (
          <div className="text-sm text-gray-500 line-through">
            {formatPrice(ORIGINAL_PRICE)}
          </div>
        )}
        <div className="text-2xl font-bold text-yellow-600">
          {formatPrice(currentPrice)}
        </div>
        {isCodeApplied && (
          <div className="text-sm text-green-600 font-medium">
            Diskon {formatPrice(DISCOUNT_AMOUNT)}!
          </div>
        )}
      </div>

      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0 w-full">
        <Link href={SAWERIA_URL} target="_blank">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade PRO (via Saweria)
        </Link>
      </Button>
      
      {/* Instruksi Penting */}
      <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded border border-slate-200">
        <p className="font-semibold text-red-500 mb-1">PENTING:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Klik tombol di atas.</li>
          <li>Isi nominal <strong>{formatPrice(currentPrice)}</strong>.</li>
          <li>
            Di kolom <strong>Pesan/Message</strong>, WAJIB tulis email login kamu: <br/>
            <span className="font-mono bg-slate-200 px-1 rounded select-all">
              {session?.user?.email || "email-kamu@contoh.com"}
            </span>
          </li>
          <li>Akun PRO aktif otomatis dalam 1-5 menit.</li>
        </ul>
      </div>

      {/* Testing Info */}
      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
        <strong>🧪 Testing:</strong> Gunakan kode "TEST15K" untuk mendapat diskon Rp 15.000
      </div>
    </div>
  );
}