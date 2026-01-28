"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Split, GitCompare, ArrowRight } from "lucide-react";
import React from 'react';

// Simple Diff Logic (Char by Char or Word by Word is complex, let's do simple line/word visual or char visual)
// For a simple implementation, let's compare characters.
// To make it robust without huge libs, we can iterate.
// OR just visualize them side by side.
// Let's do a simple comparison highlighting first difference for now or just generic side by side.

export default function DiffCheckerPage() {
    const [original, setOriginal] = useState("");
    const [modified, setModified] = useState("");

    // Basic Diff Visualization
    // This is a naive implementation for visual purposes. Real diff lib is heavy.
    const diffResult = useMemo(() => {
        if (!original && !modified) return null;

        // Split into words for simpler diffing
        const words1 = original.split(/\s+/);
        const words2 = modified.split(/\s+/);

        // We will just return the modified text but with crude highlighting
        // This is NOT a perfect Myers diff algorithm, just a visual helper.

        // Actually, for better UX without lib, let's just show mismatch index.
        let diffIndex = -1;
        for (let i = 0; i < Math.max(original.length, modified.length); i++) {
            if (original[i] !== modified[i]) {
                diffIndex = i;
                break;
            }
        }

        return { diffIndex };
    }, [original, modified]);

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <GitCompare className="h-8 w-8 text-orange-600" /> Diff Checker
                </h1>
                <p className="text-gray-500">
                    bandingkan dua teks dan lihat perbedaannya.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 h-[500px]">

                {/* ORIGINAL */}
                <div className="flex flex-col h-full space-y-2">
                    <Label className="font-bold text-gray-700">Original Text</Label>
                    <Textarea
                        placeholder="Paste original text here..."
                        className="flex-1 font-mono text-sm resize-none p-4 bg-red-50/20 border-red-200 focus:ring-red-200"
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                    />
                </div>

                {/* MODIFIED */}
                <div className="flex flex-col h-full space-y-2">
                    <Label className="font-bold text-gray-700">Modified Text</Label>
                    <Textarea
                        placeholder="Paste modified text here..."
                        className="flex-1 font-mono text-sm resize-none p-4 bg-green-50/20 border-green-200 focus:ring-green-200"
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                    />
                </div>
            </div>

            {/* RESULT */}
            <div className="mt-8">
                <Card className="bg-gray-50">
                    <CardContent className="p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Split className="w-5 h-5" /> Comparison Result
                        </h3>

                        {diffResult?.diffIndex !== undefined && diffResult.diffIndex !== -1 ? (
                            <div className="space-y-4">
                                <div className="text-red-600 p-3 bg-red-100 rounded-lg">
                                    <span className="font-bold">Difference detected at character {diffResult.diffIndex + 1}:</span>
                                    <p className="font-mono mt-1 break-all">
                                        ...{original.substring(Math.max(0, diffResult.diffIndex - 10), diffResult.diffIndex)}
                                        <span className="bg-red-300 font-bold px-1 underline">{original[diffResult.diffIndex] || "[EOF]"}</span>
                                        {original.substring(diffResult.diffIndex + 1, diffResult.diffIndex + 20)}...
                                    </p>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    *Note: This represents the FIRST difference found. Full diff visualization requires complex algorithm not loaded to keep app light.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                {original === modified && original !== "" ? (
                                    <span className="text-green-600 font-bold flex items-center justify-center gap-2">
                                        <span className="text-2xl">✓</span> Texts are Identical!
                                    </span>
                                ) : (
                                    "Differences will appear here"
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
