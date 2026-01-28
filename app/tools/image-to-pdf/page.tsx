"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Download, Image as ImageIcon, Plus } from "lucide-react";
import jsPDF from "jspdf";
import { useToolUsage } from "@/hooks/useToolUsage";
import { useToast } from "@/hooks/use-toast";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState<"p" | "l">("p"); // Portrait / Landscape
  const { isLimited, incrementUsage, remaining } = useToolUsage("image-to-pdf");
  const { toast } = useToast();

  // --- HANDLER UPLOAD ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // --- HAPUS GAMBAR ---
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- GENERATE PDF LOGIC ---
  const generatePDF = () => {
    if (images.length === 0) return;
    if (!incrementUsage()) return; // Check limit
    setLoading(true);

    try {
      // A4 Size in mm
      const pdf = new jsPDF(orientation, "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      images.forEach((img, index) => {
        if (index > 0) pdf.addPage();

        // Logic biar gambar fit to page (A4) tapi tetap proporsional
        const imgProps = pdf.getImageProperties(img.preview);
        const imgRatio = imgProps.width / imgProps.height;
        const pageRatio = pageWidth / pageHeight;

        let finalWidth = pageWidth;
        let finalHeight = pageHeight;

        // Hitung dimensi biar tidak gepeng
        if (imgRatio > pageRatio) {
          finalHeight = pageWidth / imgRatio;
        } else {
          finalWidth = pageHeight * imgRatio;
        }

        // Center image
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(img.preview, "JPEG", x, y, finalWidth, finalHeight);
      });

      pdf.save("SmartLabs-Document.pdf");
    } catch (error) {
      alert("Gagal membuat PDF. Coba kurangi ukuran gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <FileText className="h-8 w-8 text-red-600" /> JPG to PDF Converter
        </h1>
        <p className="text-gray-500">
          Gabungkan banyak foto (KTP, Tugas, Scan) jadi satu file PDF siap kumpul.
        </p>
      </div>

      {/* UPLOAD AREA */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-4 rounded-full mb-3">
              <Upload className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Klik untuk Upload Foto</h3>
            <p className="text-sm text-gray-400">Bisa pilih banyak sekaligus (JPG/PNG)</p>
          </div>
        </div>
      </div>

      {/* PREVIEW LIST */}
      {images.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              {images.length} Halaman Terpilih
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 mr-2">Orientasi Kertas:</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setOrientation("p")}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${orientation === "p" ? "bg-white shadow text-red-600" : "text-gray-500 hover:bg-gray-200"}`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setOrientation("l")}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${orientation === "l" ? "bg-white shadow text-red-600" : "text-gray-500 hover:bg-gray-200"}`}
                >
                  Landscape
                </button>
              </div>
            </div>
          </div>

          {/* GRID GAMBAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group border rounded-lg overflow-hidden bg-gray-100 aspect-[3/4]">
                <img src={img.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />

                {/* Overlay Number */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Halaman {idx + 1}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add More Button Small */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative aspect-[3/4]">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center text-gray-400">
                <Plus className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">Tambah Lagi</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={generatePDF} disabled={loading} className="bg-red-600 hover:bg-red-700 h-12 px-8 text-lg w-full md:w-auto">
              {loading ? "Memproses..." : (
                <>
                  <Download className="w-5 h-5 mr-2" /> Download PDF
                </>
              )}
            </Button>
          </div>

        </div>
      )}

      {/* Limit Indicator */}
      <div className="fixed top-24 right-4 z-50">
        <div className="bg-white/80 backdrop-blur border border-white/20 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2">
          <span>Daily Limit:</span>
          <span className={`${remaining === 0 ? 'text-red-500 font-bold' : 'text-violet-600'}`}>{remaining} left</span>
        </div>
      </div>
    </div>
  );
}