"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Copy, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function QrGeneratorPage() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopy = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          alert("QR Code copied to clipboard!");
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <QrCode className="h-8 w-8 text-blue-600" /> QR Code Generator
        </h1>
        <p className="text-gray-500">
          Buat QR Code instan untuk link, teks, atau WiFi. Gratis dan cepat.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* INPUT SECTION */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten QR</CardTitle>
              <CardDescription>Masukkan teks atau link yang ingin diubah jadi QR.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Text / URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Ukuran ({size}px)</Label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Warna Kode</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-full cursor-pointer rounded border p-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Warna Background</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-full cursor-pointer rounded border p-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW SECTION */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-b-xl border-t">
              {text ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border" ref={qrRef}>
                  <QRCodeCanvas
                    value={text}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Ketik sesuatu untuk melihat QR Code</p>
                </div>
              )}

              {text && (
                <div className="flex gap-3 mt-8 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download PNG
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
