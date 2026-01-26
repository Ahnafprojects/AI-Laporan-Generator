"use client";

import { Button } from "@/components/ui/button";
import { Crown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UpgradeButton() {
  const { data: session } = useSession();
  
  // Ganti dengan Link Saweria kamu
  const SAWERIA_URL = "https://saweria.co/smartlabseepis"; 

  return (
    <div className="flex flex-col gap-2">
      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0 w-full">
        <Link href={SAWERIA_URL} target="_blank">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade PRO (via Saweria)
        </Link>
      </Button>
      
      {/* Instruksi Penting */}
      <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded border border-slate-200">
        <p className="font-semibold text-red-500 mb-1">⚠️ PENTING:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Klik tombol di atas.</li>
          <li>Isi nominal <strong>Rp 20.000</strong>.</li>
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
}