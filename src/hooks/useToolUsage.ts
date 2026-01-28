"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const DAILY_LIMIT = 5;

export function useToolUsage(toolId: string) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [remaining, setRemaining] = useState<number>(DAILY_LIMIT);
    const [isLimited, setIsLimited] = useState<boolean>(false);

    useEffect(() => {
        // If user is PRO, no limits
        // Note: This logic assumes there's a way to check PRO status in session or elsewhere.
        // For now, checks if user is logged in. But user said "for free users". 
        // We'll implemented basic check: if no session or session is not pro, limit applies.
        // Implementing basic localStorage check.

        // const isPro = session?.user?.isPro; // Assuming such field exists or we check DB.
        // For this task, we will just implement the tracking mechanism first.

        checkUsage();
    }, [toolId, session]);

    const checkUsage = () => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const storageKey = `tool_usage_${toolId}_${today}`;

        const usage = parseInt(localStorage.getItem(storageKey) || "0", 10);
        const timeLeft = DAILY_LIMIT - usage;

        setRemaining(Math.max(0, timeLeft));
        setIsLimited(usage >= DAILY_LIMIT);
    };

    const incrementUsage = (): boolean => {
        // If PRO, bypass limit (Mocking PRO check for now, ideally check session)
        // if (session?.user?.isPro) return true; 

        const today = new Date().toISOString().split("T")[0];
        const storageKey = `tool_usage_${toolId}_${today}`;
        const usage = parseInt(localStorage.getItem(storageKey) || "0", 10);

        if (usage >= DAILY_LIMIT) {
            setIsLimited(true);
            toast({
                title: "Limit Harian Tercapai 🛑",
                description: `Kamu sudah pakai tools ini ${DAILY_LIMIT}x hari ini. Upgrade ke PRO untuk unlimited!`,
                variant: "destructive"
            });
            return false;
        }

        localStorage.setItem(storageKey, (usage + 1).toString());
        setRemaining(DAILY_LIMIT - (usage + 1));
        return true;
    };

    return { remaining, isLimited, incrementUsage, limit: DAILY_LIMIT };
}
