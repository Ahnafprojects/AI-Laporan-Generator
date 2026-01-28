"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee, Timer, Monitor, Volume2, VolumeX } from "lucide-react";

export default function PomodoroPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Timer config
    const MODES = {
        focus: { label: "Focus", time: 25 * 60, color: "text-red-500", bg: "bg-red-50", ring: "ring-red-500" },
        short: { label: "Short Break", time: 5 * 60, color: "text-emerald-500", bg: "bg-emerald-50", ring: "ring-emerald-500" },
        long: { label: "Long Break", time: 15 * 60, color: "text-blue-500", bg: "bg-blue-50", ring: "ring-blue-500" }
    };

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (soundEnabled) playNotification();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, soundEnabled]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const switchMode = (newMode: "focus" | "short" | "long") => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playNotification = () => {
        // Simple beep using AudioContext or just an alert for now. 
        // Ideally use an audio file. for simplicity we'll just log.
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(e => console.log("Audio play failed", e));
        alert("Waktu Habis! Selamat!");
    };

    const currentConfig = MODES[mode];

    return (
        <div className={`min-h-[80vh] flex items-center justify-center transition-colors duration-500 ${currentConfig.bg}`}>
            <div className="w-full max-w-md px-4">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pomodoro Focus</h1>
                    <p className="text-gray-600">Tetap fokus, jangan lupa istirahat.</p>
                </div>

                <Card className="shadow-xl bg-white/80 backdrop-blur shadow-gray-200/50 border-0">
                    <CardContent className="p-8">

                        {/* MODE SWITCHER */}
                        <div className="flex justify-center gap-2 mb-8 bg-gray-100 p-1 rounded-full w-fit mx-auto">
                            <Button
                                variant={mode === 'focus' ? "default" : "ghost"}
                                className={`rounded-full px-6 ${mode === 'focus' ? 'bg-red-500 hover:bg-red-600' : 'text-gray-600'}`}
                                onClick={() => switchMode("focus")}
                            >
                                Focus
                            </Button>
                            <Button
                                variant={mode === 'short' ? "default" : "ghost"}
                                className={`rounded-full px-6 ${mode === 'short' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-gray-600'}`}
                                onClick={() => switchMode("short")}
                            >
                                Short
                            </Button>
                            <Button
                                variant={mode === 'long' ? "default" : "ghost"}
                                className={`rounded-full px-6 ${mode === 'long' ? 'bg-blue-500 hover:bg-blue-600' : 'text-gray-600'}`}
                                onClick={() => switchMode("long")}
                            >
                                Long
                            </Button>
                        </div>

                        {/* TIMER DISPLAY */}
                        <div className="text-center mb-10 relative">
                            <div className={`text-8xl font-black tabular-nums tracking-tighter ${currentConfig.color} drop-shadow-sm`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-gray-400 font-medium uppercase tracking-widest mt-2">{currentConfig.label}</div>
                        </div>

                        {/* CONTROLS */}
                        <div className="flex justify-center items-center gap-6">
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-14 w-14 rounded-full border-2 hover:bg-gray-50"
                                onClick={soundEnabled ? () => setSoundEnabled(false) : () => setSoundEnabled(true)}
                            >
                                {soundEnabled ? <Volume2 className="h-6 w-6 text-gray-600" /> : <VolumeX className="h-6 w-6 text-gray-400" />}
                            </Button>

                            <Button
                                size="icon"
                                className={`h-20 w-20 rounded-full shadow-lg transition-transform active:scale-95 ${mode === 'focus' ? 'bg-red-500 hover:bg-red-600' : mode === 'short' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                onClick={toggleTimer}
                            >
                                {isActive ? <Pause className="h-8 w-8 fill-white" /> : <Play className="h-8 w-8 fill-white ml-1" />}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="h-14 w-14 rounded-full border-2 hover:bg-gray-50"
                                onClick={resetTimer}
                            >
                                <RotateCcw className="h-6 w-6 text-gray-600" />
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* TIPS */}
                <div className="mt-8 text-center text-sm text-gray-500 bg-white/50 p-4 rounded-xl">
                    <span className="font-bold">Tips:</span>
                    {mode === 'focus' && " Matikan notifikasi HP biar lebih fokus!"}
                    {mode === 'short' && " Peregangan badan atau minum air putih."}
                    {mode === 'long' && " Jalan-jalan sebentar, hirup udara segar."}
                </div>

            </div>
        </div>
    );
}
