"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Sparkles, LogOut, User, Users, Crown } from "lucide-react";
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
  const { data: session, status } = useSession();
  const [isProActive, setIsProActive] = useState(false);
  
  // Cek apakah user ini admin
  const isAdmin = session?.user?.email === "myticdance@gmail.com";

  // Fetch PRO status
  useEffect(() => {
    const fetchProStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/pro-status');
          if (response.ok) {
            const data = await response.json();
            setIsProActive(data.isProActive);
          }
        } catch (error) {
          console.error('Failed to fetch PRO status:', error);
        }
      }
    };
    
    if (status === 'authenticated') {
      fetchProStatus();
    }
  }, [session, status]);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sparkles className="h-6 w-6" />
          <span>AI Laporan</span>
        </Link>

        {/* Menu Kanan */}
        <div className="flex items-center gap-4">
          
          {/* LOGIC TOMBOL LOGIN / USER */}
          {status === "loading" ? (
            <div className="h-8 w-20 bg-slate-200 animate-pulse rounded" />
          ) : status === "authenticated" ? (
            // JIKA SUDAH LOGIN
            <div className="flex items-center gap-4">
              {/* PRO STATUS BUTTON - Different for PRO vs Free users */}
              {isProActive ? (
                <Link href="/upgrade">
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors cursor-pointer">
                    <Crown className="h-4 w-4" />
                    PRO Member
                  </div>
                </Link>
              ) : (
                <Link href="/upgrade">
                  <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50 font-medium">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade PRO
                  </Button>
                </Link>
              )}

              {/* <Link href="/create">
                <Button variant="default" size="sm">
                  + Buat Laporan
                </Button>
              </Link>
               */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{session.user?.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{session.user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* TAMBAHKAN INI */}
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil & Riwayat
                    </DropdownMenuItem>
                  </Link>
                  {/* -------------- */}

                  {/* MENU ADMIN KHUSUS */}
                  {isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer bg-red-50 text-red-600 font-bold hover:bg-red-100 hover:text-red-700">
                        <Users className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {/* ------------------ */}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // JIKA BELUM LOGIN
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}