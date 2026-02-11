"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Download, Loader2, Eraser, Layers } from "lucide-react";

export default function RemoveBgPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState<string>("transparent"); // transparent, red, blue, white

  // --- HANDLER UPLOAD ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setProcessedImage(null); // Reset hasil sebelumnya
      processImage(url);
    }
  };

  // --- LOGIC AI REMOVE BG ---
  const processImage = async (imageUrl: string) => {
    setLoading(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      // Config: publicPath mengarah ke folder public/static/js/ atau CDN default
      // Kita pakai default CDN biar gampang setupnya
      const blob = await removeBackground(imageUrl, {
        progress: (key, current, total) => {
          console.log(`Downloading model: ${key} ${current}/${total}`);
        }
      });

      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus background. Coba gambar lain.");
    } finally {
      setLoading(false);
    }
  };

  // --- DOWNLOAD ---
  const handleDownload = () => {
    if (!processedImage) return;

    // Kita butuh Canvas buat gabungin Image + Background Color (kalo bukan transparan)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // 1. Gambar Background (Kalo dipilih)
      if (bgColor !== "transparent") {
        ctx!.fillStyle = bgColor;
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Gambar Orang (yang udah dicrop)
      ctx!.drawImage(img, 0, 0);

      // 3. Download
      const link = document.createElement("a");
      link.download = `SmartLabs-BG-Removed-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = processedImage;
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <Eraser className="h-8 w-8 text-pink-600" /> AI Background Remover
        </h1>
        <p className="text-gray-500">
          Hapus background foto otomatis dalam hitungan detik. <br />
          Bisa ganti warna <span className="text-red-600 font-bold">Merah</span> / <span className="text-blue-600 font-bold">Biru</span> buat syarat KTP & Wisuda.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* KOLOM KIRI: UPLOAD & SETTINGS */}
        <div className="space-y-6">

          {/* UPLOAD BOX */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Upload Foto</h3>
            <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:bg-pink-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="bg-pink-100 p-4 rounded-full mb-3">
                  <ImagePlus className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-700">Pilih Foto</h3>
                <p className="text-xs text-gray-400">JPG/PNG (Maks 5MB)</p>
              </div>
            </div>
          </div>

          {/* BACKGROUND SETTINGS */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 2. Pilih Background
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBgColor("transparent")}
                className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${bgColor === "transparent" ? "ring-2 ring-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}
              >
                <div className="w-4 h-4 rounded border bg-[url('https://t3.ftcdn.net/jpg/03/66/63/52/360_F_366635299_S1MlOSe50GRfQO804Yf73Le9R9r9e9p6.jpg')] bg-cover"></div>
                Transparan
              </button>
              <button
                onClick={() => setBgColor("#ffffff")}
                className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${bgColor === "#ffffff" ? "ring-2 ring-pink-500 bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <div className="w-4 h-4 rounded border bg-white"></div>
                Putih
              </button>
              <button
                onClick={() => setBgColor("#db2721")} // Merah Standar Pas Foto
                className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${bgColor === "#db2721" ? "ring-2 ring-red-500 bg-red-50" : "hover:bg-gray-50"}`}
              >
                <div className="w-4 h-4 rounded bg-[#db2721]"></div>
                Merah
              </button>
              <button
                onClick={() => setBgColor("#0054a3")} // Biru Standar Pas Foto
                className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${bgColor === "#0054a3" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <div className="w-4 h-4 rounded bg-[#0054a3]"></div>
                Biru
              </button>
            </div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <Button
            onClick={handleDownload}
            disabled={!processedImage || loading}
            className="w-full h-14 text-lg bg-pink-600 hover:bg-pink-700 shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" /> Download Hasil HD
          </Button>

        </div>

        {/* KOLOM KANAN: PREVIEW AREA */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-6 border h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://t3.ftcdn.net/jpg/03/66/63/52/360_F_366635299_S1MlOSe50GRfQO804Yf73Le9R9r9e9p6.jpg')] bg-cover">

            {/* OVERLAY WHITE untuk membuat checkerboard agak pudar */}
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>

            {/* KONTEN UTAMA */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">

              {!imageSrc && (
                <div className="text-gray-400 text-center">
                  <ImagePlus className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium text-gray-500">Preview akan muncul di sini</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50 rounded-xl">
                  <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
                  <p className="font-bold text-gray-700">Sedang Memproses AI...</p>
                  <p className="text-xs text-gray-400 mt-2">Proses pertama mungkin agak lama (Download Model)</p>
                </div>
              )}

              {/* HASIL GAMBAR */}
              {processedImage && !loading && (
                <div
                  className="relative shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                  style={{ backgroundColor: bgColor }} // Ini yang bikin background berubah warna
                >
                  <img
                    src={processedImage}
                    alt="Hasil Remove BG"
                    className="max-h-[500px] w-auto object-contain"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
      {/* Limit Indicator */}
    </div>
  );
}
