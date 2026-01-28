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

    <div className="flex flex-col gap-4">
      {/* Redeem Code Section */}
      <div className="bg-blue-50/50 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-bold text-blue-700">Punya Kode Diskon?</span>
        </div>

        {!isCodeApplied ? (
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan kode diskon"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="text-sm bg-white/60 border-blue-200 focus:bg-white transition-all h-9"
            />
            <Button
              onClick={handleApplyCode}
              variant="outline"
              size="sm"
              disabled={!redeemCode.trim()}
              className="bg-white/50 hover:bg-white text-blue-600 border-blue-200"
            >
              Apply
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-100/80 backdrop-blur-sm p-3 rounded-lg border border-green-200">
            <div className="text-sm text-green-800">
              <span className="font-bold">Kode "TEST15K" diterapkan!</span>
              <br />
              <span>Hemat {formatPrice(DISCOUNT_AMOUNT)}</span>
            </div>
            <Button
              onClick={handleRemoveCode}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Hapus
            </Button>
          </div>
        )}
      </div>

      {/* Price Display */}
      <div className="text-center bg-yellow-50/30 p-4 rounded-xl border border-yellow-100/50">
        {isCodeApplied && (
          <div className="text-sm text-gray-400 line-through mb-1">
            {formatPrice(ORIGINAL_PRICE)}
          </div>
        )}
        <div className="text-3xl font-black text-yellow-600 tracking-tight drop-shadow-sm">
          {formatPrice(currentPrice)}
        </div>
        <div className="text-xs text-yellow-600/70 font-medium">Bebas akses semua fitur selamanya (Bulanan)</div>

        {isCodeApplied && (
          <div className="text-sm text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded-lg border border-green-100">
            Diskon {formatPrice(DISCOUNT_AMOUNT)}!
          </div>
        )}
      </div>

      <Button asChild className="h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold border-0 w-full shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all rounded-xl text-lg">
        <Link href={SAWERIA_URL} target="_blank">
          <Crown className="mr-2 h-5 w-5 fill-white" />
          Upgrade PRO (via Saweria)
        </Link>
      </Button>

      {/* Instruksi Penting */}
      <div className="text-xs text-gray-600 bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 backdrop-blur-sm">
        <p className="font-bold text-red-500 mb-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          PENTING:
        </p>
        <ul className="list-disc pl-4 space-y-2 leading-relaxed">
          <li>Klik tombol di atas untuk membuka Saweria.</li>
          <li>Isi nominal <strong>{formatPrice(currentPrice)}</strong> sesuai harga akhir.</li>
          <li>
            Di kolom <strong>Pesan/Message</strong> Saweria, WAJIB tulis email login kamu: <br />
            <div className="mt-1 font-mono bg-white border border-gray-200 px-2 py-1.5 rounded-lg select-all text-center text-violet-600 font-bold break-all shadow-sm">
              {session?.user?.email || "email-kamu@contoh.com"}
            </div>
          </li>
          <li>Akun PRO aktif otomatis dalam 1-5 menit setelah pembayaran.</li>
        </ul>
      </div>

      {/* Testing Info */}
      <div className="text-xs text-blue-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
        <strong>🧪 Mode Testing:</strong> Gunakan kode "TEST15K" untuk diskon simulasi.
      </div>
    </div>
  );
}