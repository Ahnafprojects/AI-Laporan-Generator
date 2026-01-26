import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldCheck, History, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Import komponen client yang tadi dibuat
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordForm from "@/components/profile/PasswordForm";
import HistoryTable from "@/components/profile/HistoryTable";
import RedeemForm from "@/components/payment/RedeemForm";

export default async function ProfilePage() {
  // 1. Cek Session & Ambil Data User
  const session = await getServerSession();
  
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 2. Ambil data User lengkap dari Database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      reports: {
        orderBy: { createdAt: "desc" }, // Urutkan laporan dari yang terbaru
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container py-10 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-muted-foreground">Kelola data diri dan riwayat laporan praktikum.</p>
        </div>
        <Link href="/create">
          <Button className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Biodata
          </TabsTrigger>
          <TabsTrigger value="membership">
            <Zap className="mr-2 h-4 w-4" /> Membership
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" /> Keamanan
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" /> Riwayat
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: EDIT PROFIL */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Data Mahasiswa</CardTitle>
              <CardDescription>
                Data ini akan digunakan otomatis saat membuat laporan baru.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: MEMBERSHIP & REDEEM CODE */}
        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle>Status Membership</CardTitle>
              <CardDescription>
                Kelola status langganan PRO dan klaim kode voucher.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info Status Saat Ini */}
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="font-semibold">
                  Status: {user.proExpiresAt && new Date(user.proExpiresAt) > new Date() ? "PRO MEMBER" : "User Gratis"}
                </p>
                {user.proExpiresAt && new Date(user.proExpiresAt) > new Date() && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Aktif sampai: {new Date(user.proExpiresAt).toLocaleDateString('id-ID')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Kuota harian: {user.proExpiresAt && new Date(user.proExpiresAt) > new Date() ? "50 laporan" : "3 laporan"}
                </p>
              </div>

              {/* Tombol Upgrade jika belum PRO */}
              {!(user.proExpiresAt && new Date(user.proExpiresAt) > new Date()) && (
                <div className="p-4 border border-dashed rounded-lg">
                  <h4 className="font-medium mb-2">Upgrade ke PRO</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Dapatkan akses unlimited dan fitur-fitur premium.
                  </p>
                  <Link href="/upgrade">
                    <Button className="w-full">
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade ke PRO - Rp 20.000/bulan
                    </Button>
                  </Link>
                </div>
              )}

              {/* Form Redeem Code */}
              <RedeemForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: GANTI PASSWORD */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Ganti Password</CardTitle>
              <CardDescription>
                Pastikan menggunakan password yang aman.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: RIWAYAT LAPORAN */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Laporan</CardTitle>
              <CardDescription>
                Daftar semua laporan yang pernah Anda buat. Klik tombol untuk membuka dan download ulang.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryTable reports={user.reports} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}