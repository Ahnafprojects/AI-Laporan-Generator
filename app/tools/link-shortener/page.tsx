"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link2, QrCode, Copy, Download, ArrowRight } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react"; // Pakai Canvas biar bisa didownload

export default function LinkShortenerPage() {
  const [longUrl, setLongUrl] = useState("");
  const [result, setResult] = useState<{ short: string; original: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // --- FUNGSI PENDEKIN LINK ---
  const handleShorten = async () => {
    if (!longUrl) return;
    setLoading(true);
    setResult(null); // Reset result
    try {
      const res = await fetch("/api/tools/shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
      });
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
      } else {
        alert(data.error || "Gagal memendekkan link. Pastikan link valid.");
      }
    } catch (e) {
      console.error("Error:", e);
      alert("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI COPY ---
  const handleCopy = () => {
    if (result?.short) {
      navigator.clipboard.writeText(result.short);
      alert("Link berhasil dicopy!");
    }
  };

  // --- FUNGSI DOWNLOAD QR ---
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "SmartLabs-QR.png";
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <Link2 className="h-8 w-8 text-blue-600"/> Link Shortener & QR
        </h1>
        <p className="text-gray-500">
          Ubah link panjang ribet jadi pendek & QR Code siap cetak untuk banner/poster.
        </p>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 mb-8">
        <Input 
          placeholder="Tempel Link Panjang di sini (https://...)" 
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="flex-1 h-12 text-lg"
        />
        <Button onClick={handleShorten} disabled={loading || !longUrl} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-lg">
          {loading ? <Loader2 className="animate-spin"/> : "Pendekkan! ⚡"}
        </Button>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* KIRI: LINK PENDEK */}
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-blue-800 font-bold mb-4 uppercase tracking-wider text-sm">Link Pendek Kamu</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6 break-all">
              {result.short}
            </div>
            <div className="flex gap-3 w-full">
              <Button onClick={handleCopy} className="flex-1 bg-white text-blue-600 border border-blue-200 hover:bg-blue-100">
                <Copy className="w-4 h-4 mr-2"/> Copy Link
              </Button>
              <Button onClick={() => window.open(result.short, '_blank')} variant="outline" className="px-3">
                <ArrowRight className="w-4 h-4"/>
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4">Link Asli: {result.original}</p>
          </div>

          {/* KANAN: QR CODE */}
          <div className="bg-white p-8 rounded-xl border shadow-sm flex flex-col items-center">
            <h3 className="text-gray-800 font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4"/> QR Code HD
            </h3>
            
            {/* AREA QR */}
            <div ref={qrRef} className="p-4 bg-white border-2 border-gray-900 rounded-lg mb-6">
              <QRCodeCanvas 
                value={result.short} // QR isinya Link Pendek biar gampang discan
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"} // High Error Correction (Bisa discan walau agak rusak)
                includeMargin={true}
              />
            </div>

            <Button onClick={handleDownloadQR} className="w-full bg-gray-900 hover:bg-black">
              <Download className="w-4 h-4 mr-2"/> Download QR (PNG)
            </Button>
          </div>

        </div>
      )}

    </div>
  );
}