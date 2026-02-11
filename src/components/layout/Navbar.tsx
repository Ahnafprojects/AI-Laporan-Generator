"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogOut, User, Users, Crown, Wrench, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const sessionIsProActive = Boolean(
    session?.user &&
      "isProActive" in session.user &&
      (session.user as { isProActive?: boolean }).isProActive
  );
  const [isProActive, setIsProActive] = useState(sessionIsProActive);
  const [scrolled, setScrolled] = useState(false);

  // Cek apakah user ini admin
  const isAdmin = session?.user?.email === "myticdance@gmail.com";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    router.prefetch("/create");
    router.prefetch("/profile?tab=profile");
    router.prefetch("/profile?tab=history");
    router.prefetch("/upgrade");
    if (isAdmin) router.prefetch("/admin");
  }, [router, status, isAdmin]);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsProActive(false);
      return;
    }

    let isMounted = true;
    const syncProStatus = async () => {
      try {
        const res = await fetch("/api/payment/check-status", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) return;
        if (isMounted) {
          setIsProActive(Boolean(data?.isProActive));
        }
      } catch {
        if (isMounted) {
          setIsProActive(sessionIsProActive);
        }
      }
    };

    setIsProActive(sessionIsProActive);
    void syncProStatus();

    return () => {
      isMounted = false;
    };
  }, [status, sessionIsProActive]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4 px-4'}`}>
      <nav className={`max-w-7xl mx-auto transition-all duration-300 ${scrolled
        ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 shadow-sm rounded-none w-full max-w-none px-6 py-3'
        : 'bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-xl shadow-indigo-500/5 px-6 py-3'
        }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-violet-600 transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 h-6 w-6 text-purple-400 opacity-50 animate-pulse blur-sm"></div>
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              SmartLabs
            </span>
          </Link>

          {/* Menu Kanan */}
          <div className="flex items-center gap-4">
            {/* LOGIC TOMBOL LOGIN / USER */}
            {status === "loading" ? (
              <div className="h-9 w-24 bg-gray-200/50 animate-pulse rounded-full" />
            ) : status === "authenticated" ? (
              // JIKA SUDAH LOGIN
              <div className="flex items-center gap-4">
                {/* PRO STATUS BUTTON */}
                {isProActive ? (
                  <Link href="/upgrade">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100/50 to-orange-100/50 border border-amber-200/50 backdrop-blur-md text-amber-700 rounded-full text-xs font-bold hover:shadow-md transition-all cursor-pointer">
                      <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                      PRO MEMBER
                    </div>
                  </Link>
                ) : (
                  <Link href="/upgrade">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 rounded-full text-xs font-semibold transition-all cursor-pointer group">
                      <Crown className="h-3.5 w-3.5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      UPGRADE
                    </div>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ring-2 ring-white/50 hover:bg-violet-50 hover:text-violet-600 transition-all">
                      <div className="h-full w-full rounded-full bg-gradient-to-tr from-violet-100 to-indigo-100 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl p-2 rounded-xl">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{session.user?.name}</span>
                        <span className="text-xs text-gray-500 font-normal truncate">{session.user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200/50" />

                    <Link href="/profile?tab=profile">
                      <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-violet-50 focus:text-violet-700 p-2.5">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile?tab=history">
                      <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-violet-50 focus:text-violet-700 p-2.5">
                        <History className="mr-2 h-4 w-4" />
                        Histori
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/#tools">
                      <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-violet-50 focus:text-violet-700 p-2.5">
                        <Wrench className="mr-2 h-4 w-4" />
                        Tools
                      </DropdownMenuItem>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer rounded-lg bg-red-50 text-red-600 font-bold focus:bg-red-100 focus:text-red-700 p-2.5 mt-1">
                          <Users className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </Link>
                    )}

                    <DropdownMenuSeparator className="bg-gray-200/50" />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600 cursor-pointer rounded-lg focus:bg-red-50 focus:text-red-700 p-2.5">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // JIKA BELUM LOGIN
              <div className="flex gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-violet-50 hover:text-violet-600 rounded-full font-medium transition-all">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Daftar Gratis
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
