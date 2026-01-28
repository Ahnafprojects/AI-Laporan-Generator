"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ArrowUp, ArrowDown, Trash2, Merge, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useToolUsage } from "@/hooks/useToolUsage";
import { useToast } from "@/hooks/use-toast";

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { isLimited, incrementUsage, remaining } = useToolUsage("pdf-merger");
  const { toast } = useToast();

  // --- HANDLER UPLOAD ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Tambahkan file baru ke list yang sudah ada
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // --- ATUR URUTAN (NAIK/TURUN) ---
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // --- LOGIC PENGGABUNGAN PDF ---
  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Minimal pilih 2 file PDF untuk digabungkan.");
      return;
    }

    if (!incrementUsage()) return; // Check limit

    setLoading(true);

    try {
      // 1. Buat Dokumen Kosong
      const mergedPdf = await PDFDocument.create();

      // 2. Loop setiap file yang diupload
      for (const file of files) {
        // Baca file jadi ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Load PDF-nya
        const pdf = await PDFDocument.load(fileBuffer);

        // Ambil semua halaman
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        // Tempel ke Dokumen Kosong
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 3. Simpan & Download
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Merged-SmartLabs-${new Date().getTime()}.pdf`;
      link.click();

    } catch (error) {
      console.error(error);
      alert("Gagal menggabungkan PDF. Pastikan file tidak dikunci password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <Merge className="h-8 w-8 text-purple-600" /> PDF Merger
        </h1>
        <p className="text-gray-500">
          Gabungkan file Cover, Bab, dan Lampiran jadi satu file PDF utuh.
        </p>
      </div>

      {/* UPLOAD AREA */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:bg-purple-50 transition-colors relative cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-4 rounded-full mb-3">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Klik untuk Tambah File PDF</h3>
            <p className="text-sm text-gray-400">Pilih file Cover, Bab 1, Bab 2, dll.</p>
          </div>
        </div>
      </div>

      {/* FILE LIST (SORTABLE) */}
      {files.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Urutan File ({files.length})</h3>
            <p className="text-xs text-gray-500">Atur urutan dari atas ke bawah (Halaman 1 dst)</p>
          </div>

          <div className="space-y-3">
            {files.map((file, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">

                {/* Icon & Name */}
                <div className="bg-red-100 p-2 rounded text-red-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 border-l pl-3">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                    title="Geser Naik"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                    title="Geser Turun"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded ml-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-4 border-t">
            <Button
              onClick={mergePDFs}
              disabled={loading || files.length < 2}
              className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Sedang Menggabungkan..." : (
                <>
                  <Download className="w-5 h-5 mr-2" /> Gabungkan PDF Sekarang
                </>
              )}
            </Button>
            {files.length < 2 && (
              <p className="text-xs text-center text-red-400 mt-2">
                *Minimal upload 2 file untuk digabung.
              </p>
            )}
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