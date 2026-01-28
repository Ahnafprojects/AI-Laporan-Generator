"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, RefreshCw, Lock, ShieldCheck } from "lucide-react";

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState("Strong");

    const generatePassword = () => {
        let charset = "";
        if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (includeNumbers) charset += "0123456789";
        if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        if (charset === "") {
            setPassword("");
            return;
        }

        let generatedPassword = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            generatedPassword += charset[randomIndex];
        }
        setPassword(generatedPassword);
        calculateStrength(length);
    };

    const calculateStrength = (len: number) => {
        if (len < 8) setStrength("Weak");
        else if (len < 12) setStrength("Medium");
        else setStrength("Strong");
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        alert("Password copied to clipboard!");
    };

    const getStrengthColor = () => {
        if (strength === "Weak") return "text-red-500";
        if (strength === "Medium") return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <Lock className="h-8 w-8 text-indigo-600" /> Password Generator
                </h1>
                <p className="text-gray-500">
                    Buat password super kuat dan aman dalam hitungan detik. Anti-hack!
                </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-indigo-600">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Generate Password</CardTitle>
                        <div className={`flex items-center gap-1 font-semibold ${getStrengthColor()}`}>
                            <ShieldCheck className="w-5 h-5" /> {strength}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* DISPLAY PASSWORD */}
                    <div className="relative group">
                        <div className="bg-gray-100 p-6 rounded-xl text-center font-mono text-3xl tracking-wider break-all text-gray-800 border-2 border-transparent hover:border-indigo-200 transition-colors">
                            {password}
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="hover:bg-white" onClick={generatePassword}>
                                <RefreshCw className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="secondary" onClick={handleCopy}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border">

                        {/* LENGTH SLIDER */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="font-semibold text-gray-700">Panjang Password</Label>
                                <span className="font-bold text-indigo-600 text-lg bg-indigo-50 px-3 py-0.5 rounded-md">{length}</span>
                            </div>
                            <Slider
                                defaultValue={[16]}
                                max={64}
                                min={4}
                                step={1}
                                value={[length]}
                                onValueChange={(val) => setLength(val[0])}
                                className="py-2"
                            />
                        </div>

                        {/* OPTIONS CHECKBOXES */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
                                <input type="checkbox" id="uppercase" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <Label htmlFor="uppercase" className="cursor-pointer">Huruf Besar (A-Z)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
                                <input type="checkbox" id="lowercase" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <Label htmlFor="lowercase" className="cursor-pointer">Huruf Kecil (a-z)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
                                <input type="checkbox" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <Label htmlFor="numbers" className="cursor-pointer">Angka (0-9)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
                                <input type="checkbox" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <Label htmlFor="symbols" className="cursor-pointer">Simbol (!@#$)</Label>
                            </div>
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg" onClick={handleCopy}>
                            <Copy className="mr-2 h-5 w-5" /> Copy Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
