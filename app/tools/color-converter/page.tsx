"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Copy, RefreshCw, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function ColorConverterPage() {
    const { toast } = useToast();

    // State for colors
    const [hex, setHex] = useState("#6366f1");
    const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
    const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
    const [copied, setCopied] = useState<string | null>(null);

    // Conversion Logic
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    // Handlers
    const handleHexChange = (val: string) => {
        setHex(val);
        const rgbVal = hexToRgb(val);
        if (rgbVal) {
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        }
    };

    const handleRgbChange = (key: 'r' | 'g' | 'b', val: number) => {
        const newRgb = { ...rgb, [key]: val };
        setRgb(newRgb);
        setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast({ title: "Copied!", description: `${text} copied to clipboard.` });
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Limit Indicator */}
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm">
                        <Palette className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Color Converter</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Konversi warna antar format HEX, RGB, dan HSL secara real-time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Visual Preview */}
                    <div className="glass-panel p-8 rounded-3xl flex items-center justify-center min-h-[300px] relative transition-all duration-500" style={{ backgroundColor: hex }}>
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg text-center">
                            <span className="font-mono text-xl font-bold uppercase text-gray-800">{hex}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="glass-panel p-8 rounded-3xl space-y-8">

                        {/* HEX Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-500">HEX Color</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                                    <Input
                                        value={hex.replace("#", "")}
                                        onChange={(e) => handleHexChange("#" + e.target.value)}
                                        className="pl-8 font-mono uppercase bg-white/50 border-white/20"
                                        maxLength={6}
                                    />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(hex, 'hex')}>
                                    {copied === 'hex' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* RGB Sliders */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-500">RGB</label>
                                <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}>
                                    {copied === 'rgb' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400"><span>R</span><span>{rgb.r}</span></div>
                                <Slider value={[rgb.r]} max={255} step={1} onValueChange={(v) => handleRgbChange('r', v[0])} className="[&>.relative>.absolute]:bg-red-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400"><span>G</span><span>{rgb.g}</span></div>
                                <Slider value={[rgb.g]} max={255} step={1} onValueChange={(v) => handleRgbChange('g', v[0])} className="[&>.relative>.absolute]:bg-green-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400"><span>B</span><span>{rgb.b}</span></div>
                                <Slider value={[rgb.b]} max={255} step={1} onValueChange={(v) => handleRgbChange('b', v[0])} className="[&>.relative>.absolute]:bg-blue-500" />
                            </div>
                        </div>

                        {/* HSL Readonly */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <label className="text-sm font-medium text-gray-500">HSL</label>
                            <div className="flex gap-2 items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                <div className="flex-1 font-mono text-sm">
                                    hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}>
                                    {copied === 'hsl' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
