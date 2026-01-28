"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, Type, Hash, Clock, FileText, Trash2, Copy } from "lucide-react";

export default function WordCounterPage() {
    const [text, setText] = useState("");

    const stats = useMemo(() => {
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, "").length;
        const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length;
        const readingTime = Math.ceil(words / 200); // approx 200 wpm

        return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert("Teks berhasil disalin!");
    };

    const handleClear = () => {
        if (confirm("Yakin ingin menghapus semua teks?")) {
            setText("");
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <AlignLeft className="h-8 w-8 text-green-600" /> Word Counter
                </h1>
                <p className="text-gray-500">
                    Hitung kata, karakter, paragraf, dan estimasi waktu baca secara realtime.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* INPUT AREA */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="h-full flex flex-col shadow-md">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>Editor Teks</CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={handleCopy} disabled={!text}>
                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={handleClear} disabled={!text}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Clear
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <Textarea
                                placeholder="Ketik atau tempel teks di sini..."
                                className="w-full h-[500px] border-none focus-visible:ring-0 resize-none text-lg p-6 leading-relaxed"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>
                        <div className="bg-gray-50 p-2 text-xs text-gray-400 text-center border-t">
                            Mendukung pengetikan langsung atau paste dari dokumen lain.
                        </div>
                    </Card>
                </div>

                {/* STATS AREA */}
                <div className="lg:col-span-1 space-y-6">

                    {/* PRIMARY STATS */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-indigo-700 mb-1">{stats.words}</div>
                                <div className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Kata</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-50 border-emerald-100">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-emerald-700 mb-1">{stats.chars}</div>
                                <div className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Karakter</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* DETAILED LIST */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Detail Statistik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b last:border-0">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Type className="w-4 h-4" /> Karakter (no space)
                                </div>
                                <span className="font-bold">{stats.charsNoSpace}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b last:border-0">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FileText className="w-4 h-4" /> Paragraf
                                </div>
                                <span className="font-bold">{stats.paragraphs}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b last:border-0">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Hash className="w-4 h-4" /> Kalimat
                                </div>
                                <span className="font-bold">{stats.sentences}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b last:border-0 bg-yellow-50 -mx-6 px-6 rounded-b-lg">
                                <div className="flex items-center gap-2 text-yellow-700 font-medium">
                                    <Clock className="w-4 h-4" /> Waktu Baca
                                </div>
                                <span className="font-bold text-yellow-800">± {stats.readingTime} menit</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                        <p className="font-semibold mb-1">Tips:</p>
                        Waktu baca dihitung berdasarkan kecepatan rata-rata manusia membaca (200 kata/menit).
                    </div>

                </div>
            </div>
        </div>
    );
}
