"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Upload, Image as ImageIcon, Download, ArrowRight, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function ImageCompressorPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [previewCompressed, setPreviewCompressed] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Helper: Format Bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: "destructive", title: "Invalid File", description: "Please upload an image file (JPG, PNG)." });
        return;
      }
      setOriginalFile(file);
      setPreviewOriginal(URL.createObjectURL(file));
      // Auto compress initially
      compressImage(file, quality[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalFile(file);
      setPreviewOriginal(URL.createObjectURL(file));
      compressImage(file, quality[0]);
    }
  };

  // Compression Logic using Canvas
  const compressImage = (file: File, q: number) => {
    setIsCompressing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedFile(blob);
            setPreviewCompressed(URL.createObjectURL(blob));
          }
          setIsCompressing(false);
        }, file.type, q / 100);
      };
    };
  };

  // Effect: Re-compress when quality changes
  useEffect(() => {
    if (originalFile) {
      const timer = setTimeout(() => {
        compressImage(originalFile, quality[0]);
      }, 300); // Debounce
      return () => clearTimeout(timer);
    }
  }, [quality]);

  // Reset
  const handleReset = () => {
    setOriginalFile(null);
    setPreviewOriginal(null);
    setPreviewCompressed(null);
    setCompressedFile(null);
    setQuality([80]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Download
  const handleDownload = () => {
    if (compressedFile && originalFile) {
      const url = URL.createObjectURL(compressedFile);
      const link = document.createElement('a');
      link.href = url;
      // Add -min suffix before extension
      const nameParts = originalFile.name.split('.');
      const ext = nameParts.pop();
      link.download = `${nameParts.join('.')}-min.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Limit Indicator */}
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />

      <main className="flex-1 container px-4 py-24 mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-pink-100 text-pink-600 mb-4 shadow-sm">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Image Compressor</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Kompres gambar JPG/PNG tanpa mengurangi visual quality. Proses berjalan di browser, gambar aman.
          </p>
        </div>

        {!originalFile ? (
          /* Upload Area */
          <div
            className="glass-panel border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-violet-400 transition-colors cursor-pointer group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="h-20 w-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="h-10 w-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Drag & Drop Image Here</h3>
            <p className="text-gray-500">or click to browse file (JPG, PNG)</p>
          </div>
        ) : (
          /* Editor Area */
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Controls */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between">
                  <label className="font-medium text-gray-700">Quality: {quality[0]}%</label>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${quality[0] < 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {quality[0] < 50 ? 'High Compression' : 'Good Quality'}
                  </span>
                </div>
                <Slider value={quality} min={10} max={100} step={1} onValueChange={setQuality} className="[&>.relative>.absolute]:bg-pink-500" />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleReset} className="rounded-full">
                  <X className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={handleDownload} disabled={!compressedFile} className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-full shadow-lg shadow-pink-200">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>

            {/* Previews */}
            <div className="grid md:grid-cols-2 gap-8">

              {/* Original */}
              <div className="glass-panel p-6 rounded-3xl text-center relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 bg-gray-900/70 text-white text-xs px-2 py-1 rounded backdrop-blur">Original</div>
                <div className="h-64 flex items-center justify-center bg-gray-100/50 rounded-xl overflow-hidden mb-4">
                  {previewOriginal && <img src={previewOriginal} alt="Original" className="max-h-full max-w-full object-contain" />}
                </div>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                  <span>{formatBytes(originalFile.size)}</span>
                </div>
              </div>

              {/* Compressed */}
              <div className="glass-panel p-6 rounded-3xl text-center relative overflow-hidden border-2 border-pink-500/20 shadow-xl shadow-pink-100/50">
                <div className="absolute top-4 left-4 z-10 bg-pink-600 text-white text-xs px-2 py-1 rounded shadow-md">Compressed</div>
                {isCompressing ? (
                  <div className="h-64 flex items-center justify-center bg-gray-100/50 rounded-xl mb-4">
                    <RefreshCw className="h-8 w-8 text-pink-500 animate-spin" />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-100/50 rounded-xl overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-[url('/transparent-bg.png')] opacity-10"></div> {/* Checkboard pattern placeholder */}
                    {previewCompressed && <img src={previewCompressed} alt="Compressed" className="max-h-full max-w-full object-contain relative z-10" />}
                  </div>
                )}
                <div className="flex justify-center items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">{compressedFile ? formatBytes(compressedFile.size) : '...'}</span>
                  {compressedFile && (
                    <span className="text-green-600 text-xs px-2 py-0.5 bg-green-100 rounded-full">
                      -{Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
