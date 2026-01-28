"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeftRight, Copy, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function UrlEncoder() {
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);

    const handleConvert = (currentInput: string, currentMode: "encode" | "decode") => {
        try {
            if (!currentInput) {
                setOutput("");
                return;
            }

            let result = "";
            if (currentMode === "encode") {
                result = encodeURIComponent(currentInput);
            } else {
                result = decodeURIComponent(currentInput);
            }
            setOutput(result);
        } catch (error) {
            setOutput("Error: Invalid URL format");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        handleConvert(e.target.value, mode);
    };

    const toggleMode = () => {
        const newMode = mode === "encode" ? "decode" : "encode";
        setMode(newMode);
        setInput(output);
        handleConvert(output, newMode);
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast({ title: "Copied!", description: "URL result copied." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-purple-100 text-purple-600 mb-4 shadow-sm">
                        <LinkIcon className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">URL Encoder/Decoder</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Format URL agar aman untuk browser (persen-encoding) atau kembalikan ke bentuk asli.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl relative">
                    <div className="flex flex-col md:flex-row gap-6 items-stretch">

                        {/* Input Section */}
                        <div className="flex-1 space-y-3">
                            <label className="text-sm font-medium text-gray-500">
                                {mode === "encode" ? "Decoded URL (Original)" : "Encoded URL"}
                            </label>
                            <Textarea
                                placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com..."}
                                value={input}
                                onChange={handleInputChange}
                                className="min-h-[250px] font-mono text-sm bg-white/50 border-white/20 resize-none focus:ring-purple-500/20"
                            />
                        </div>

                        {/* Middle Control */}
                        <div className="flex flex-col justify-center items-center gap-2">
                            <Button
                                onClick={toggleMode}
                                className="rounded-full h-10 w-10 p-0 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-transform hover:rotate-180"
                            >
                                <ArrowLeftRight className="h-4 w-4 text-white" />
                            </Button>
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 space-y-3 relative">
                            <label className="text-sm font-medium text-gray-500">
                                {mode === "encode" ? "Encoded URL" : "Decoded URL"}
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
