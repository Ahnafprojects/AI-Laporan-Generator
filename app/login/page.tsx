"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Cek URL parameters untuk pesan verifikasi
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === 'true') {
      toast({
        title: "Email Terverifikasi!",
        description: "Akun Anda berhasil diverifikasi. Silakan login.",
      });
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error Verifikasi",
        description: error,
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Cek apakah error karena email belum diverifikasi
        if (result.error.includes("Email belum diverifikasi")) {
          toast({
            variant: "destructive",
            title: "Email Belum Diverifikasi",
            description: "Silakan cek email Anda dan klik link verifikasi terlebih dahulu.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login gagal",
            description: "Email atau password salah.",
          });
        }
      } else {
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali.",
        });

        // Smart Redirect: Use callbackUrl if present, otherwise default to /create
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          // Force HTTPS to avoid redirect loops if the env var generated an http link
          const secureUrl = callbackUrl.replace("http://", "https://");
          router.push(secureUrl);
        } else {
          router.push("/create");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">

      {/* LIQUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-purple-400 top-0 left-0 opacity-20"></div>
        <div className="liquid-blob bg-blue-400 bottom-0 right-0 animation-delay-4000 opacity-20"></div>
      </div>

      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              SmartLabs
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h1>
          <p className="text-gray-500 mt-2">Masuk untuk mulai generate laporanmu.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-gray-200 focus:bg-white transition-all h-12"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 border-gray-200 focus:bg-white transition-all h-12 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">
                Lupa Password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk Sekarang"}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-600 mt-8">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-violet-600 hover:underline">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

// Loading component untuk Suspense fallback
function LoadingLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Memuat...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main exported component dengan Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingLogin />}>
      <LoginForm />
    </Suspense>
  );
}