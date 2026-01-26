import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Zap } from "lucide-react";
import Link from "next/link";
import CancelSubscriptionButton from "@/components/payment/CancelSubscriptionButton";
import UpgradeButton from "@/components/payment/UpgradeButton";

export default async function UpgradePage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  const isProActive = user?.proExpiresAt && new Date(user.proExpiresAt) > new Date();

  if (isProActive) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-md mx-auto">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Anda Sudah PRO! </h1>
          <p className="text-muted-foreground mb-6">
            Membership PRO Anda aktif hingga {user.proExpiresAt?.toLocaleDateString("id-ID")}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/create">
              <Button className="w-full">Buat Laporan Sekarang</Button>
            </Link>
            <CancelSubscriptionButton />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Membership akan tetap aktif hingga tanggal berakhir meski dibatalkan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade ke PRO 👑</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dapatkan akses unlimited untuk menggenerate laporan praktikum tanpa batas!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* FREE PLAN */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Gratis
            </CardTitle>
            <div className="text-3xl font-bold">Free</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>3 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className ="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
          </CardContent>
        </Card>

        {/* PRO MONTHLY PLAN */}
        <Card className="border-2 border-blue-300 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              POPULAR
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-blue-500" />
              PRO Monthly
            </CardTitle>
            <div className="text-3xl font-bold">Rp 20.000</div>
            <div className="text-sm text-muted-foreground">per bulan</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">50 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">No Ads</span>
            </div>
            
            <div className="pt-4">
              <UpgradeButton plan="monthly" />
            </div>
          </CardContent>
        </Card>

        {/* PRO YEARLY PLAN */}
        <Card className="border-2 border-yellow-300 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              BEST VALUE
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              PRO Yearly
            </CardTitle>
            <div className="text-3xl font-bold">Rp 180.000</div>
            <div className="text-sm text-muted-foreground">per tahun</div>
            <div className="text-sm text-green-600 font-medium">Hemat Rp 60.000!</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">50 laporan per hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Format PENS standar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>AI Groq Llama 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Export ke Word</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">25% Discount</span>
            </div>
            
            <div className="pt-4">
              <UpgradeButton plan="yearly" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Pembayaran aman melalui Midtrans. Dapat dibatalkan kapan saja.
        </p>
      </div>
    </div>
  );
}