"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Database, Code, PlayCircle, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useToolUsage } from "@/hooks/useToolUsage";

export default function SqlFormatter() {
    const { toast } = useToast();
    const [input, setInput] = useState("SELECT * FROM users WHERE id = 1 AND active = true ORDER BY created_at DESC");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const { isLimited, incrementUsage, remaining } = useToolUsage("sql-formatter");

    // Basic SQL Formatter (Regex-based)
    // Note: This is a simple client-side formatter for common SQL
    const formatSql = () => {
        if (!input) return;
        if (!incrementUsage()) return; // Limit usage on format

        let sql = input
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\(\s+/g, '(')
            .replace(/\s+\)/g, ')')
            .trim();

        const keywords = [
            "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
            "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
            "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "JOIN", "UNION"
        ];

        // Placeholder replacement to protect strings
        // (Simplified for this basic version)

        // Add newlines before keywords
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            sql = sql.replace(regex, (match) => `\n${match.toUpperCase()}`);
        });

        // Indentation logic
        const lines = sql.split('\n');
        let formatted = "";
        let indentLevel = 0;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // Simple heuristic for indentation
            if (line.toUpperCase().startsWith("SELECT") || line.toUpperCase().startsWith("UPDATE") || line.toUpperCase().startsWith("INSERT")) {
                indentLevel = 0;
            }

            formatted += "  ".repeat(indentLevel) + line + "\n";

            // Indent after keywords
            if (keywords.some(kw => line.toUpperCase().includes(kw))) {
                // indentLevel = 1; // Simplified
            }
        });

        // Cleaner approach: Just basic keyword newline
        let formattedSimple = sql.trim(); // The keyword replacement above did most work

        setOutput(formattedSimple);
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast({ title: "Copied!", description: "Formatted SQL copied." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-blob"></div>
            </div>

            {/* Limit Indicator */}
            <div className="fixed top-24 right-4 z-50">
                <div className="bg-white/80 backdrop-blur border border-white/20 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span>Daily Limit:</span>
                    <span className={`${remaining === 0 ? 'text-red-500 font-bold' : 'text-violet-600'}`}>{remaining} left</span>
                </div>
            </div>

            <Navbar />

            <main className="flex-1 container px-4 py-24 mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                        <Database className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">SQL Formatter</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Rapikan query SQL yang berantakan dalam satu klik.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl relative min-h-[500px] flex flex-col md:flex-row gap-8">

                    {/* Input */}
                    <div className="flex-1 flex flex-col gap-3">
                        <label className="text-sm font-bold text-gray-500 uppercase">Input SQL</label>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 min-h-[300px] font-mono text-sm bg-white/50 border-white/20 resize-none focus:ring-orange-500/20 p-4"
                            placeholder="Paste messy SQL here..."
                        />
                    </div>

                    {/* Action */}
                    <div className="flex flex-col justify-center items-center gap-4">
                        <Button onClick={formatSql} className="rounded-full h-14 w-14 p-0 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200 transition-transform hover:scale-110">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Button>
                    </div>

                    {/* Output */}
                    <div className="flex-1 flex flex-col gap-3 relative">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-500 uppercase">Formatted SQL</label>
                            {output && (
                                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 text-xs gap-1">
                                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />} Copy
                                </Button>
                            )}
                        </div>
                        <div className="flex-1 min-h-[300px] bg-slate-900 rounded-xl border border-white/10 p-4 overflow-auto relative group">
                            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                                {output || <span className="text-gray-600 italic">Result will appear here...</span>}
                            </pre>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
