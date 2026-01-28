"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RefreshCw, Type, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";

const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export default function LoremGeneratorPage() {
    const [count, setCount] = useState(3);
    const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
    const [generated, setGenerated] = useState("");

    useEffect(() => {
        generateLorem();
    }, [count, type]);

    const generateLorem = () => {
        let result = "";
        if (type === "words") {
            const words = LOREM_TEXT.replace(/[.,]/g, "").split(" ");
            let temp = [];
            for (let i = 0; i < count; i++) {
                temp.push(words[i % words.length]);
            }
            result = temp.join(" ");
        }
        else if (type === "sentences") {
            const sentences = LOREM_TEXT.split(". ");
            let temp = [];
            for (let i = 0; i < count; i++) {
                temp.push(sentences[i % sentences.length].trim() + ".");
            }
            result = temp.join(" ");
        }
        else {
            // Paragraphs
            let temp = [];
            for (let i = 0; i < count; i++) {
                temp.push(LOREM_TEXT);
            }
            result = temp.join("\n\n");
        }
        setGenerated(result);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generated);
        alert("Copied to clipboard!");
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <FileText className="h-8 w-8 text-gray-600" /> Lorem Ipsum Generator
                </h1>
                <p className="text-gray-500">
                    Generate dummy text untuk layout design kamu.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* CONTROLS */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label>Type</Label>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant={type === "paragraphs" ? "default" : "outline"}
                                        className="justify-start"
                                        onClick={() => setType("paragraphs")}
                                    >
                                        Paragraphs
                                    </Button>
                                    <Button
                                        variant={type === "sentences" ? "default" : "outline"}
                                        className="justify-start"
                                        onClick={() => setType("sentences")}
                                    >
                                        Sentences
                                    </Button>
                                    <Button
                                        variant={type === "words" ? "default" : "outline"}
                                        className="justify-start"
                                        onClick={() => setType("words")}
                                    >
                                        Words
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Jumlah ({count})</Label>
                                </div>
                                <Slider
                                    value={[count]}
                                    min={1}
                                    max={50}
                                    step={1}
                                    onValueChange={(val) => setCount(val[0])}
                                />
                            </div>

                            <Button className="w-full bg-gray-800 text-white hover:bg-black" onClick={handleCopy}>
                                <Copy className="w-4 h-4 mr-2" /> Copy Text
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW */}
                <div className="md:col-span-2">
                    <div className="relative border rounded-xl p-6 bg-white shadow-sm min-h-[400px]">
                        <p className="whitespace-pre-wrap text-gray-600 leading-relaxed font-serif text-lg">
                            {generated}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
