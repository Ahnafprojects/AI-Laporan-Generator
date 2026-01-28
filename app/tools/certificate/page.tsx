"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, Upload, Download, Type, Move, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function CertificateGeneratorPage() {
  const [template, setTemplate] = useState<string | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null); // Simpan file asli untuk dimensi
  const [names, setNames] = useState("Budi Santoso\nSiti Aminah\nAhmad Fauzi");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings Teks
  const [settings, setSettings] = useState({
    x: 50, // Center default (percentage)
    y: 50, // Center default (percentage)
    size: 24,
    color: "#000000",
    font: "helvetica"
  });

  // --- HANDLER UPLOAD TEMPLATE ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTemplate(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PREVIEW RENDER ---
  // Kita pakai canvas sederhana atau styling CSS absolute untuk preview posisi
  // Tapi untuk akurasi tinggi, kita visualisasikan style CSS di atas gambar
  
  // --- BULK GENERATE LOGIC ---
  const generateCertificates = async () => {
    if (!template || !templateFile) return;
    const nameList = names.split("\n").filter(n => n.trim() !== "");
    if (nameList.length === 0) {
      alert("Masukkan minimal satu nama peserta!");
      return;
    }

    setLoading(true);
    setProgress(0);
    const zip = new JSZip();

    try {
      // 1. Dapatkan Dimensi Gambar Asli
      // Kita pakai trick load image ke HTML Image Object buat tau width/height
      const img = new Image();
      img.src = template;
      await new Promise((r) => (img.onload = r));

      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Hitung Rasio ke A4 / Landscape (PDF biasanya 297x210 mm)
      // Disini kita akan buat PDF ukuran CUSTOM sesuai ukuran gambar (Pixel to Point)
      // Biar kualitas HD.
      
      for (let i = 0; i < nameList.length; i++) {
        const participantName = nameList[i].trim();
        
        // Setup PDF orientasi Landscape (default sertifikat)
        // Unit: pt (points) biar lebih presisi dengan pixel
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "l" : "p",
          unit: "px",
          format: [imgWidth, imgHeight]
        });

        // Add Image (Full Canvas)
        pdf.addImage(template, "PNG", 0, 0, imgWidth, imgHeight);

        // Add Text
        pdf.setFont(settings.font, "bold"); // Default bold biar tegas
        // Fix: Konversi ukuran font dari pixel (preview) ke points (PDF)
        // Ratio: 1px ≈ 0.75pt, tapi kita adjust biar pas
        const pdfFontSize = settings.size * (imgWidth / 800); // Scale based on image width
        pdf.setFontSize(pdfFontSize);
        pdf.setTextColor(settings.color);
        
        // Logic Center Text Alignment
        // Koordinat X di PDF library mulai dari kiri. 
        // Settings.x kita adalah persentase (0-100%) dari lebar gambar
        const xPos = (imgWidth * settings.x) / 100;
        const yPos = (imgHeight * settings.y) / 100;

        pdf.text(participantName, xPos, yPos, { align: "center" });

        // Add to Zip
        const blob = pdf.output("blob");
        zip.file(`${participantName}.pdf`, blob);

        // Update Progress
        setProgress(Math.round(((i + 1) / nameList.length) * 100));
        // Kasih jeda dikit biar browser gak nge-freeze
        await new Promise(r => setTimeout(r, 10)); 
      }

      // Generate Zip & Download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Sertifikat-Event-${new Date().getTime()}.zip`);

    } catch (error) {
      console.error(error);
      alert("Gagal membuat sertifikat.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <BadgeCheck className="h-8 w-8 text-yellow-600"/> E-Certificate Generator
        </h1>
        <p className="text-gray-500">
          Buat ratusan sertifikat peserta otomatis. Upload template, copy nama, download ZIP.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: SETTINGS */}
        <div className="space-y-6">
          
          {/* 1. UPLOAD */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4"/> 1. Upload Template
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer relative">
              <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
              <p className="text-xs text-gray-500">Klik pilih gambar (JPG/PNG)</p>
            </div>
          </div>

          {/* 2. DATA NAMA */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Type className="w-4 h-4"/> 2. Daftar Nama
            </h3>
            <Textarea 
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Satu nama per baris..."
              className="h-40 font-mono text-sm"
            />
            <p className="text-xs text-gray-400">Total: {names.split("\n").filter(n=>n.trim()).length} Penerima</p>
          </div>

          {/* 3. STYLING */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Move className="w-4 h-4"/> 3. Atur Posisi
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500">Posisi Horizontal (X)</label>
                <input 
                  type="range" min="0" max="100" 
                  value={settings.x}
                  onChange={(e) => setSettings({...settings, x: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Kiri ← {settings.x}% → Kanan</p>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500">Posisi Vertikal (Y)</label>
                <input 
                  type="range" min="0" max="100" 
                  value={settings.y}
                  onChange={(e) => setSettings({...settings, y: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Atas ↑ {settings.y}% ↓ Bawah</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500">Ukuran Font</label>
                   <Input 
                      type="number" value={settings.size} 
                      onChange={(e) => setSettings({...settings, size: parseInt(e.target.value)})}
                      min="10" max="200"
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500">Warna</label>
                   <div className="flex gap-2 mt-1">
                      <input 
                        type="color" value={settings.color}
                        onChange={(e) => setSettings({...settings, color: e.target.value})}
                        className="w-full h-9 rounded cursor-pointer"
                      />
                   </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500">Jenis Font</label>
                <Select value={settings.font} onValueChange={(val) => setSettings({...settings, font: val})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">Helvetica (Sans-Serif)</SelectItem>
                    <SelectItem value="times">Times New Roman (Serif)</SelectItem>
                    <SelectItem value="courier">Courier (Monospace)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <Button 
            onClick={generateCertificates} 
            disabled={loading || !template}
            className="w-full h-14 text-lg bg-yellow-600 hover:bg-yellow-700 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin"/> {progress}%
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5"/> Generate PDF (ZIP)
              </div>
            )}
          </Button>

        </div>

        {/* KOLOM KANAN: PREVIEW */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-4 border h-full min-h-[500px] flex items-center justify-center relative overflow-hidden">
            
            {!template && (
              <div className="text-gray-400 text-center">
                <BadgeCheck className="w-16 h-16 mx-auto mb-2 opacity-20"/>
                <p>Upload template sertifikat dulu di sebelah kiri.</p>
              </div>
            )}

            {template && (
              <div className="relative shadow-2xl max-w-full">
                {/* TEMPLATE IMAGE */}
                <img src={template} alt="Preview" className="max-w-full h-auto rounded" />

                {/* TEXT OVERLAY (SIMULASI POSISI) */}
                <div 
                  style={{
                    position: "absolute",
                    top: `${settings.y}%`,
                    left: `${settings.x}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: `${settings.size}px`,
                    color: settings.color,
                    fontWeight: "bold",
                    fontFamily: settings.font === "times" ? "'Times New Roman', Times, serif" : 
                               settings.font === "courier" ? "'Courier New', Courier, monospace" : 
                               "Helvetica, Arial, sans-serif",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    textShadow: "0 0 2px rgba(255,255,255,0.5)"
                  }}
                >
                  [ Nama Peserta ]
                </div>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            *Preview posisi mungkin sedikit berbeda dengan hasil PDF. Coba generate 1 nama dulu untuk tes.
          </p>
        </div>

      </div>
    </div>
  );
}