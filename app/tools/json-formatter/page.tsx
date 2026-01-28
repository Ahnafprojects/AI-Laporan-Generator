"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Braces, Copy, Trash2, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

export default function JsonFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const formatJson = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                setError(null);
                return;
            }
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setOutput("");
        }
    };

    const minifyJson = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                setError(null);
                return;
            }
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setOutput("");
        }
    }

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            alert("JSON copied to clipboard!");
        }
    };

    const loadSample = () => {
        const sample = {
            "status": "success",
            "data": {
                "id": 1,
                "name": "Project Ahnaf",
                "features": ["AI Generator", "Tools", "Analysis"],
                "active": true
            }
        };
        setInput(JSON.stringify(sample));
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <Braces className="h-8 w-8 text-orange-600" /> JSON Formatter & Validator
                </h1>
                <p className="text-gray-500">
                    Rapikan JSON yang berantakan, validasi error, atau minify untuk production.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 h-[600px]">

                {/* INPUT */}
                <div className="flex flex-col h-full space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-semibold text-gray-700">Input JSON</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs text-blue-600">
                                Load Sample
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setInput("")} className="text-xs text-red-500 hover:text-red-700">
                                <Trash2 className="w-3 h-3 mr-1" /> Clear
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        placeholder="Paste messy JSON here..."
                        className="flex-1 font-mono text-sm resize-none p-4"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* OUTPUT */}
                <div className="flex flex-col h-full space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="font-semibold text-gray-700">Output</span>
                        <Button size="sm" variant="outline" onClick={handleCopy} disabled={!output}>
                            <Copy className="w-3 h-3 mr-2" /> Copy Result
                        </Button>
                    </div>
                    <div className={`flex-1 border rounded-md relative bg-gray-50 overflow-hidden flex flex-col ${error ? 'border-red-300 bg-red-50' : ''}`}>

                        {error ? (
                            <div className="p-6 text-red-600">
                                <div className="flex items-center gap-2 font-bold mb-2">
                                    <AlertTriangle className="w-5 h-5" /> Invalid JSON
                                </div>
                                <p className="font-mono text-sm break-all">{error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={output}
                                className="flex-1 font-mono text-sm bg-transparent border-none resize-none p-4 focus-visible:ring-0 text-gray-800"
                                placeholder="Result will appear here..."
                            />
                        )}
                    </div>
                </div>

            </div>

            {/* ACTION BAR */}
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" onClick={formatJson}>
                    <CheckCircle className="w-5 h-5 mr-2" /> Prettify / Format
                </Button>
                <Button size="lg" variant="outline" className="min-w-[150px]" onClick={minifyJson}>
                    <ArrowRight className="w-5 h-5 mr-2" /> Minify
                </Button>
            </div>

        </div>
    );
}
