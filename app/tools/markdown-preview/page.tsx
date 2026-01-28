"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Eye, Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useToolUsage } from "@/hooks/useToolUsage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreview() {
    const { toast } = useToast();
    const [markdown, setMarkdown] = useState("# Hello World\n\n**Start typing** markdown here...\n\n- Item 1\n- Item 2\n\n```js\nconsole.log('Code block');\n```");
    const [copied, setCopied] = useState(false);
    const { isLimited, incrementUsage, remaining } = useToolUsage("markdown-preview");

    const copyToClipboard = () => {
        if (!incrementUsage()) return; // Limit usage on copy
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        toast({ title: "Copied!", description: "Markdown copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-slate-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Limit Indicator */}
            <div className="fixed top-24 right-4 z-50">
                <div className="bg-white/80 backdrop-blur border border-white/20 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span>Daily Limit:</span>
                    <span className={`${remaining === 0 ? 'text-red-500 font-bold' : 'text-violet-600'}`}>{remaining} left</span>
                </div>
            </div>

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-600 mb-4 shadow-sm">
                        <FileText className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Markdown Live Preview</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Tulis markdown dan lihat hasilnya secara real-time. Support GFM (Tables, Checklists, dll).
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-3xl h-[70vh] flex flex-col md:flex-row gap-4">

                    {/* Editor */}
                    <div className="flex-1 flex flex-col gap-2 h-full">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Code className="h-4 w-4" /> Editor
                            </label>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 text-xs gap-1">
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />} Copy
                            </Button>
                        </div>
                        <Textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="flex-1 font-mono text-sm bg-white/50 border-white/20 resize-none focus:ring-gray-400/20 p-4"
                            placeholder="Type markdown here..."
                        />
                    </div>

                    {/* Separator */}
                    <div className="hidden md:block w-px bg-gray-200 my-4"></div>

                    {/* Preview */}
                    <div className="flex-1 flex flex-col gap-2 h-full min-h-[300px]">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Eye className="h-4 w-4" /> Preview
                            </label>
                        </div>
                        <div className="flex-1 bg-white/70 rounded-xl border border-white/30 p-6 overflow-y-auto prose prose-slate max-w-none prose-sm dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
