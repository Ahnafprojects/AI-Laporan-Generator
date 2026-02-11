"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Fingerprint, Copy, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function UuidGenerator() {
    const { toast } = useToast();
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState([5]);
    // Simplified to v4 mostly

    const generateUUID = () => {
        // Basic v4 implementation using crypto API
        const newIds = Array.from({ length: count[0] }, () => crypto.randomUUID());
        setUuids(newIds);
    };

    // Initial load
    useState(() => {
        if (typeof window !== 'undefined') {
            setTimeout(generateUUID, 100);
        }
    });

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join("\n"));
        toast({ title: "Copied All", description: `${uuids.length} UUIDs copied.` });
    };

    const copyOne = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({ title: "Copied!", duration: 1000 });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-blob"></div>
            </div>

            {/* Limit Indicator */}

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-green-100 text-green-600 mb-4 shadow-sm">
                        <Fingerprint className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">UUID Generator</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Generate Universal Unique Identifier (UUID) v4 secara bulk.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl space-y-6">

                    {/* Controls */}
                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-white/40">
                        <div className="flex items-center gap-4 flex-1">
                            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Count: {count[0]}</span>
                            <Slider value={count} min={1} max={50} step={1} onValueChange={setCount} className="max-w-[200px] [&>.relative>.absolute]:bg-green-500" />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={copyAll} variant="outline" className="hidden sm:flex">
                                <Copy className="mr-2 h-4 w-4" /> Copy All
                            </Button>
                            <Button onClick={generateUUID} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
                                <RefreshCw className="mr-2 h-4 w-4" /> Generate
                            </Button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {uuids.map((id, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/60 hover:bg-green-50/50 border border-transparent hover:border-green-100 rounded-lg transition-colors group">
                                <span className="font-mono text-gray-600 text-lg">{id}</span>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyOne(id)}>
                                    <Copy className="h-4 w-4 text-gray-400 hover:text-green-600" />
                                </Button>
                            </div>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
