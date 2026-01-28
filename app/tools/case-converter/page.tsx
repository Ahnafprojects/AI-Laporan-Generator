"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Type, CaseUpper, CaseLower, CaseSensitive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CaseConverterPage() {
    const [text, setText] = useState("");

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert("Teks berhasil disalin!");
    };

    const convertCase = (type: string) => {
        let newText = "";
        switch (type) {
            case "upper":
                newText = text.toUpperCase();
                break;
            case "lower":
                newText = text.toLowerCase();
                break;
            case "title":
                newText = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                break;
            case "sentence":
                newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                break;
            case "camel":
                newText = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case "snake":
                newText = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('_') || text;
                break;
            case "kebab":
                newText = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('-') || text;
                break;
            case "alternating":
                newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
            default:
                newText = text;
        }
        setText(newText);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <Type className="h-8 w-8 text-indigo-600" /> Case Converter
                </h1>
                <p className="text-gray-500">
                    Ubah format huruf teks kamu secara instan: Uppercase, Lowercase, Title Case, dan lainnya.
                </p>
            </div>

            <Card className="shadow-md">
                <CardContent className="p-6 space-y-4">

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-2 justify-center pb-4 border-b">
                        <Button variant="outline" onClick={() => convertCase("upper")}>UPPERCASE</Button>
                        <Button variant="outline" onClick={() => convertCase("lower")}>lowercase</Button>
                        <Button variant="outline" onClick={() => convertCase("title")}>Title Case</Button>
                        <Button variant="outline" onClick={() => convertCase("sentence")}>Sentence case</Button>
                        <Button variant="outline" onClick={() => convertCase("camel")}>camelCase</Button>
                        <Button variant="outline" onClick={() => convertCase("snake")}>snake_case</Button>
                        <Button variant="outline" onClick={() => convertCase("kebab")}>kebab-case</Button>
                        <Button variant="outline" onClick={() => convertCase("alternating")}>aLtErNaTiNg</Button>
                    </div>

                    <div className="relative">
                        <Textarea
                            placeholder="Ketik atau tempel teks di sini..."
                            className="min-h-[300px] text-lg p-6 bg-gray-50 focus:bg-white transition-colors resize-y font-mono"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur shadow-sm hover:bg-white" onClick={() => setText("")} title="Clear">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="secondary" className="shadow-sm" onClick={handleCopy} title="Copy">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-400 px-1">
                        <span>{text.length} Character(s) | {text.split(/\s+/).filter(Boolean).length} Word(s)</span>
                        <span className="italic">Pro Tip: Use buttons above to convert instantly</span>
                    </div>

                </CardContent>
            </Card>

        </div>
    );
}
