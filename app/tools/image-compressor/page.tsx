"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; // Pastikan punya komponen Slider (Shadcn) atau ganti input range biasa
import { Upload, Download, Image as ImageIcon, ArrowRight, RefreshCcw } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState("");
  const [previewCompressed, setPreviewCompressed] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Setting Kompresi
  const [quality, setQuality] = useState(0.8); // 0.1 - 1.0
  const [maxWidth, setMaxWidth] = useState(1920);

  // --- HANDLER UPLOAD ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setPreviewOriginal(URL.createObjectURL(file));
      handleCompress(file, quality, maxWidth);
    }
  };

  // --- LOGIC KOMPRESI UTAMA ---
  const handleCompress = async (file: File, q: number, w: number) => {
    setLoading(true);
    try {
      const options = {
        maxSizeMB: 1, // Target awal (nanti diabaikan kalau pakai quality)
        maxWidthOrHeight: w,
        useWebWorker: true,
        initialQuality: q, // Kualitas (0 - 1)
      };

      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      setPreviewCompressed(URL.createObjectURL(compressed));
    } catch (error) {
      alert("Gagal kompres gambar.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMAT SIZE (KB/MB) ---
  const formatSize = (size: number) => {
    return (size / 1024).toFixed(2) + " KB";
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <ImageIcon className="h-8 w-8 text-orange-600"/> Image Compressor
        </h1>
        <p className="text-gray-500">
          Kecilkan ukuran foto buat upload ke web kampus/beasiswa. Aman, proses di browser.
        </p>
      </div>

      {/* AREA UPLOAD */}
      {!originalFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Upload Foto (JPG/PNG)</h3>
            <p className="text-sm text-gray-400 mt-1">Maksimal 10MB</p>
          </div>
        </div>
      )}

      {/* EDITOR & PREVIEW */}
      {originalFile && (
        <div className="space-y-8">
          
          {/* CONTROL PANEL */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Pengaturan Kompresi</h3>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCcw className="w-4 h-4 mr-2"/> Reset
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Kualitas ({Math.round(quality * 100)}%)</label>
                {/* Kalau belum punya component Slider, ganti pakai <input type="range" /> */}
                <input 
                  type="range" min="0.1" max="1" step="0.1" 
                  value={quality} 
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    handleCompress(originalFile, parseFloat(e.target.value), maxWidth);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Geser kiri = File makin kecil (kualitas turun).</p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Max Width ({maxWidth}px)</label>
                <select 
                  value={maxWidth} 
                  onChange={(e) => {
                    setMaxWidth(parseInt(e.target.value));
                    handleCompress(originalFile, quality, parseInt(e.target.value));
                  }}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="1920">Full HD (1920px)</option>
                  <option value="1280">HD (1280px)</option>
                  <option value="800">Web Standard (800px)</option>
                  <option value="500">Pas Foto (500px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* DUAL PREVIEW */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* ORIGINAL */}
            <div className="border rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-red-600">Original</span>
                <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  {formatSize(originalFile.size)}
                </span>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={previewOriginal} alt="Ori" className="max-h-64 object-contain" />
              </div>
            </div>

            {/* COMPRESSED */}
            <div className="border rounded-xl p-4 bg-green-50 relative">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-green-600">Hasil Kompresi</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                  {compressedFile ? formatSize(compressedFile.size) : "..."}
                </span>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}
                <img src={previewCompressed} alt="Compressed" className="max-h-64 object-contain" />
              </div>
              
              {/* SAVINGS BADGE */}
              {compressedFile && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    Hemat: <span className="font-bold text-green-600">
                      {Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%
                    </span>
                  </span>
                </div>
              )}

              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700" 
                disabled={!compressedFile}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewCompressed;
                  link.download = `compressed-${originalFile.name}`;
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2"/> Download Gambar
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}