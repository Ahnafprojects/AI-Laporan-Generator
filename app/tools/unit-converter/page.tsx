"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Ruler, Weight, Thermometer } from "lucide-react";

type UnitType = "length" | "weight" | "temperature";

const UNITS = {
    length: [
        { value: "m", label: "Meter (m)" },
        { value: "cm", label: "Centimeter (cm)" },
        { value: "km", label: "Kilometer (km)" },
        { value: "ft", label: "Feet (ft)" },
        { value: "in", label: "Inch (in)" },
    ],
    weight: [
        { value: "kg", label: "Kilogram (kg)" },
        { value: "g", label: "Gram (g)" },
        { value: "lb", label: "Pound (lb)" },
        { value: "oz", label: "Ounce (oz)" },
    ],
    temperature: [
        { value: "c", label: "Celsius (°C)" },
        { value: "f", label: "Fahrenheit (°F)" },
        { value: "k", label: "Kelvin (K)" },
    ]
};

export default function UnitConverterPage() {
    const [type, setType] = useState<UnitType>("length");
    const [fromValue, setFromValue] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState<string>("");
    const [toUnit, setToUnit] = useState<string>("");
    const [result, setResult] = useState<number>(0);

    // Set default units when type changes
    useEffect(() => {
        setFromUnit(UNITS[type][0].value);
        setToUnit(UNITS[type][1].value);
    }, [type]);

    useEffect(() => {
        convert();
    }, [fromValue, fromUnit, toUnit, type]);

    const convert = () => {
        let val = fromValue;
        let res = 0;

        // Implement logic manually or use library. manual is fine for simple stuff.
        if (type === "length") {
            // Convert to base unit (meter)
            let inMeter = val;
            if (fromUnit === "cm") inMeter = val / 100;
            if (fromUnit === "km") inMeter = val * 1000;
            if (fromUnit === "ft") inMeter = val / 3.28084;
            if (fromUnit === "in") inMeter = val / 39.3701;

            // Convert from base to target
            if (toUnit === "m") res = inMeter;
            if (toUnit === "cm") res = inMeter * 100;
            if (toUnit === "km") res = inMeter / 1000;
            if (toUnit === "ft") res = inMeter * 3.28084;
            if (toUnit === "in") res = inMeter * 39.3701;
        }
        else if (type === "weight") {
            // Base unit: kg
            let inKg = val;
            if (fromUnit === "g") inKg = val / 1000;
            if (fromUnit === "lb") inKg = val * 0.453592;
            if (fromUnit === "oz") inKg = val * 0.0283495;

            if (toUnit === "kg") res = inKg;
            if (toUnit === "g") res = inKg * 1000;
            if (toUnit === "lb") res = inKg / 0.453592;
            if (toUnit === "oz") res = inKg / 0.0283495;
        }
        else if (type === "temperature") {
            let inC = val;
            if (fromUnit === 'f') inC = (val - 32) * 5 / 9;
            if (fromUnit === 'k') inC = val - 273.15;

            if (toUnit === 'c') res = inC;
            if (toUnit === 'f') res = (inC * 9 / 5) + 32;
            if (toUnit === 'k') res = inC + 273.15;
        }

        setResult(res);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <ArrowRightLeft className="h-8 w-8 text-cyan-600" /> Unit Converter
                </h1>
                <p className="text-gray-500">
                    Konversi satuan Panjang, Berat, dan Suhu dengan presisi.
                </p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                <Button
                    variant={type === "length" ? "default" : "outline"}
                    className={type === "length" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                    onClick={() => setType("length")}
                >
                    <Ruler className="w-4 h-4 mr-2" /> Length
                </Button>
                <Button
                    variant={type === "weight" ? "default" : "outline"}
                    className={type === "weight" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                    onClick={() => setType("weight")}
                >
                    <Weight className="w-4 h-4 mr-2" /> Weight
                </Button>
                <Button
                    variant={type === "temperature" ? "default" : "outline"}
                    className={type === "temperature" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                    onClick={() => setType("temperature")}
                >
                    <Thermometer className="w-4 h-4 mr-2" /> Temp
                </Button>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">

                        {/* FROM */}
                        <div className="flex-1 w-full space-y-2">
                            <Label>Dari (From)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    className="text-lg"
                                    value={fromValue}
                                    onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                                />
                                <select
                                    className="border rounded-md px-3 bg-white min-w-[120px]"
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                >
                                    {UNITS[type].map(u => (
                                        <option key={u.value} value={u.value}>{u.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-gray-400">
                            <ArrowRightLeft className="w-6 h-6 rotate-90 md:rotate-0" />
                        </div>

                        {/* TO */}
                        <div className="flex-1 w-full space-y-2">
                            <Label>Ke (To)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    className="text-lg font-bold bg-gray-50 text-cyan-700"
                                    readOnly
                                    value={Number.isInteger(result) ? result : result.toFixed(4)}
                                />
                                <select
                                    className="border rounded-md px-3 bg-white min-w-[120px]"
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                >
                                    {UNITS[type].map(u => (
                                        <option key={u.value} value={u.value}>{u.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        {fromValue} {UNITS[type].find(u => u.value === fromUnit)?.label} = <span className="font-bold text-gray-900">{Number.isInteger(result) ? result : result.toFixed(4)} {UNITS[type].find(u => u.value === toUnit)?.label}</span>
                    </div>

                </CardContent>
            </Card>

        </div>
    );
}
