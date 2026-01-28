"use client";

import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { PenTool, Download, Eraser, RotateCcw } from "lucide-react";

export default function SignaturePage() {
  const sigPad = useRef<SignatureCanvas>(null);
  const [penColor, setPenColor] = useState("black");
  const [hasSigned, setHasSigned] = useState(false);

  // --- HANDLERS ---
  const clear = () => {
    sigPad.current?.clear();
    setHasSigned(false);
  };

  const download = () => {
    if (sigPad.current?.isEmpty()) {
      alert("Tanda tangan dulu dong, masih kosong nih!");
      return;
    }
    
    // Convert canvas ke Data URL (PNG)
    const canvas = sigPad.current?.getCanvas();
    if (!canvas) return;
    
    // Trim canvas manually to remove white space
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    // Add padding
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);
    
    const trimmedWidth = maxX - minX;
    const trimmedHeight = maxY - minY;
    
    // Create new canvas with trimmed size
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedContext = trimmedCanvas.getContext('2d');
    
    if (trimmedContext) {
      trimmedContext.drawImage(
        canvas,
        minX, minY, trimmedWidth, trimmedHeight,
        0, 0, trimmedWidth, trimmedHeight
      );
      
      const dataURL = trimmedCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `tanda-tangan-${new Date().getTime()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <PenTool className="h-8 w-8 text-blue-600"/> Digital Signature
        </h1>
        <p className="text-gray-500">
          Buat tanda tangan digital background transparan. <br/>
          Cocok buat ditempel di Word, PDF, atau Canva.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: EDITOR */}
        <div className="md:col-span-2 space-y-4">
          
          {/* CANVAS AREA */}
          <div className="border-2 border-gray-300 border-dashed rounded-xl bg-white overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-3 left-3 text-xs text-gray-400 select-none pointer-events-none">
              Area Tanda Tangan
            </div>
            
            <SignatureCanvas 
              ref={sigPad}
              penColor={penColor}
              canvasProps={{
                className: "w-full h-80 cursor-crosshair",
                style: { width: '100%', height: '320px' } 
              }}
              onBegin={() => setHasSigned(true)}
              velocityFilterWeight={0.7} // Biar goresan halus
              minWidth={1.5} // Tebal tipis pen
              maxWidth={3.5}
            />
          </div>

          <p className="text-xs text-center text-gray-400">
            💡 Tips: Gunakan Touchscreen (HP/Tablet) untuk hasil terbaik.
          </p>
        </div>

        {/* KOLOM KANAN: CONTROLS */}
        <div className="space-y-6">
          
          {/* PILIHAN WARNA */}
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Warna Tinta</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setPenColor("black")}
                className={`w-10 h-10 rounded-full bg-black border-2 transition-transform ${penColor === "black" ? "scale-110 ring-2 ring-offset-2 ring-gray-400" : ""}`}
                title="Hitam"
              />
              <button 
                onClick={() => setPenColor("blue")}
                className={`w-10 h-10 rounded-full bg-blue-700 border-2 transition-transform ${penColor === "blue" ? "scale-110 ring-2 ring-offset-2 ring-blue-400" : ""}`}
                title="Biru (Basah)"
              />
              <button 
                onClick={() => setPenColor("red")}
                className={`w-10 h-10 rounded-full bg-red-600 border-2 transition-transform ${penColor === "red" ? "scale-110 ring-2 ring-offset-2 ring-red-400" : ""}`}
                title="Merah (Paraf)"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
            <Button onClick={download} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
              <Download className="w-5 h-5 mr-2"/> Download PNG
            </Button>
            
            <Button onClick={clear} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2"/> Hapus / Ulang
            </Button>
          </div>

          {/* INFO */}
          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 leading-relaxed border border-blue-100">
            <strong>Kenapa Transparan?</strong> <br/>
            Agar saat ditempel di dokumen Word/PDF, tanda tanganmu menyatu dengan kertas, tidak menutupi tulisan di belakangnya (tidak ada kotak putih).
          </div>

        </div>

      </div>
    </div>
  );
}