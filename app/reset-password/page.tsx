'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Token tidak valid atau sudah expired",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak sama",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Berhasil!",
          description: "Password berhasil direset. Silakan login dengan password baru."
        });
        router.push('/login');
      } else {
        toast({
          title: "Error",
          description: data.error || "Terjadi kesalahan saat reset password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat reset password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
        {/* LIQUID BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="liquid-blob bg-red-400 top-20 right-20 opacity-20"></div>
          <div className="liquid-blob bg-orange-400 bottom-10 left-10 animation-delay-2000 opacity-20"></div>
        </div>

        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Token Tidak Valid</h2>
          <p className="text-gray-500 mb-6">Link reset password ini sudah kadaluarsa atau tidak valid.</p>
          <Button onClick={() => router.push('/forgot-password')} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">
            Kirim Ulang Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-10">
      {/* LIQUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-teal-400 top-20 right-20 opacity-20"></div>
        <div className="liquid-blob bg-emerald-400 bottom-10 left-10 animation-delay-2000 opacity-20"></div>
      </div>

      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password 🔒</h1>
          <p className="text-gray-500 mt-2">Buat password baru yang kuat dan aman.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                disabled={isLoading}
                className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
                minLength={6}
                disabled={isLoading}
                className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Ubah Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              disabled={isLoading}
              className="text-gray-500 hover:text-teal-600 font-medium"
            >
              Kembali ke Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component untuk Suspense fallback
function LoadingResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Memuat...</CardTitle>
          <CardDescription>
            Memverifikasi token reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main exported component dengan Suspense wrapper
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingResetPassword />}>
      <ResetPasswordForm />
    </Suspense>
  );
}