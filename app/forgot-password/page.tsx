"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast({
        title: "Email Terkirim! 📧",
        description: "Silakan cek email Anda untuk link reset password."
      });
      setEmailSent(true);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Terkirim!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Kami telah mengirim link reset password ke email <strong>{email}</strong>.
              Silakan cek inbox atau spam folder Anda.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-10">
      {/* LIQUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-cyan-400 top-20 right-20 opacity-20"></div>
        <div className="liquid-blob bg-blue-400 bottom-10 left-10 animation-delay-2000 opacity-20"></div>
      </div>

      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Lupa Password?</h1>
          <p className="text-gray-500 mt-2">Jangan panik, kami bantu reset passwordmu.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Terdaftar</label>
              <Input
                name="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-gray-200 focus:bg-white transition-all h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Link Reset Password"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-gray-500 hover:text-violet-600 inline-flex items-center font-medium transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}