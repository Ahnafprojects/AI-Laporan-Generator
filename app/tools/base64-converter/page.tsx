"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeftRight, Copy, Check, Binary, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useToolUsage } from "@/hooks/useToolUsage";

export default function Base64Converter() {
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);
    const { isLimited, incrementUsage, remaining } = useToolUsage("base64-converter");

    const handleConvert = (currentInput: string, currentMode: "encode" | "decode") => {
        try {
            if (!currentInput) {
                setOutput("");
                return;
            }

            let result = "";
            if (currentMode === "encode") {
                result = btoa(currentInput);
            } else {
                result = atob(currentInput);
            }
            setOutput(result);
        } catch (error) {
            setOutput("Error: Invalid input for decoding");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        handleConvert(e.target.value, mode);
    };

    const toggleMode = () => {
        // Swap input/output if valid
        const newMode = mode === "encode" ? "decode" : "encode";
        setMode(newMode);
        setInput(output);
        handleConvert(output, newMode);
    };

    const copyToClipboard = () => {
        if (!output) return;
        if (!incrementUsage()) return; // Limit usage on copy
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast({ title: "Copied!", description: "Result copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Limit Indicator */}
            <div className="fixed top-24 right-4 z-50">
                <div className="bg-white/80 backdrop-blur border border-white/20 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span>Daily Limit:</span>
                    <span className={`${remaining === 0 ? 'text-red-500 font-bold' : 'text-violet-600'}`}>{remaining} left</span>
                </div>
            </div>

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-sm">
                        <Binary className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Base64 Converter</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Encode dan Decode text ke format Base64 dengan cepat.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl relative">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch">

                        {/* Input Section */}
                        <div className="flex-1 space-y-3">
                            <label className="text-sm font-medium text-gray-500">
                                {mode === "encode" ? "Text Source" : "Base64 String"}
                            </label>
                            <Textarea
                                placeholder={mode === "encode" ? "Type text here..." : "Paste Base64 here..."}
                                value={input}
                                onChange={handleInputChange}
                                className="min-h-[250px] font-mono text-sm bg-white/50 border-white/20 resize-none focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Middle Control */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <Button
                                onClick={toggleMode}
                                className="rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform hover:rotate-180"
                            >
                                <ArrowLeftRight className="h-4 w-4 text-white" />
                            </Button>
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 space-y-3 relative">
                            <label className="text-sm font-medium text-gray-500">
                                {mode === "encode" ? "Base64 Output" : "Plain Text"}
                            </label>
                            <div className="relative h-full">
                                <Textarea
                                    readOnly
                                    value={output}
                                    className="h-full min-h-[250px] font-mono text-sm bg-slate-100/50 border-white/20 resize-none text-gray-600"
                                />
                                {output && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={copyToClipboard}
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
                                    </Button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
