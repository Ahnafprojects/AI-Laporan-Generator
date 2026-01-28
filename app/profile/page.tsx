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
    <div className="min-h-screen relative overflow-hidden bg-slate-50 pt-20 pb-10">
      {/* LIQUID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="liquid-blob bg-purple-400 top-0 left-0 opacity-20"></div>
        <div className="liquid-blob bg-blue-300 bottom-0 right-0 animation-delay-2000 opacity-20"></div>
        <div className="liquid-blob bg-pink-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animation-delay-4000 opacity-10"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Profil Saya</h1>
            <p className="text-gray-500 font-medium">Kelola data diri dan riwayat laporan praktikum.</p>
          </div>
          <Link href="/create">
            <Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
              <Zap className="h-4 w-4" />
              Buat Laporan Baru
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl bg-white/40 backdrop-blur-md p-1 rounded-xl border border-white/20">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
              <User className="mr-2 h-4 w-4" /> Biodata
            </TabsTrigger>
            <TabsTrigger value="membership" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600">
              <Zap className="mr-2 h-4 w-4" /> Membership
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700">
              <ShieldCheck className="mr-2 h-4 w-4" /> Keamanan
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              <History className="mr-2 h-4 w-4" /> Riwayat
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: EDIT PROFIL */}
          <TabsContent value="profile">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Data Mahasiswa</h2>
                <p className="text-sm text-gray-500">Data ini akan digunakan otomatis saat membuat laporan baru.</p>
              </div>
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          {/* TAB 2: MEMBERSHIP & REDEEM CODE */}
          <TabsContent value="membership">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Status Membership</h2>
                <p className="text-sm text-gray-500">Kelola status langganan PRO dan klaim kode voucher.</p>
              </div>

              <div className="space-y-4">
                {/* Info Status Saat Ini */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/60 to-slate-50/60 border border-white/40 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="h-24 w-24 text-amber-500" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Status Langganan</p>
                    <p className="font-black text-2xl text-gray-900 flex items-center gap-2">
                      {user.proExpiresAt && new Date(user.proExpiresAt) > new Date() ? (
                        <>
                          <span className="text-amber-500">PRO MEMBER</span> ⚡
                        </>
                      ) : "Starter Plan"}
                    </p>

                    {user.proExpiresAt && new Date(user.proExpiresAt) > new Date() && (
                      <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                        Aktif sampai: {new Date(user.proExpiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        <span>Kuota: <strong>{user.proExpiresAt && new Date(user.proExpiresAt) > new Date() ? "50" : "3"}</strong> /hari</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Upgrade jika belum PRO */}
                {!(user.proExpiresAt && new Date(user.proExpiresAt) > new Date()) && (
                  <div className="p-6 border border-dashed border-violet-200 rounded-xl bg-violet-50/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-violet-700 mb-1">Upgrade ke PRO 🚀</h4>
                        <p className="text-sm text-gray-600">
                          Dapatkan akses unlimited dan fitur-fitur premium.
                        </p>
                      </div>
                      <Link href="/upgrade">
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-lg shadow-violet-200 hover:shadow-xl hover:scale-105 transition-all">
                          <Zap className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-100" />
                          Upgrade PRO - Rp 20.000/bln
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Form Redeem Code */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-gray-900 mb-4">Punya Kode Voucher?</h4>
                  <RedeemForm />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: GANTI PASSWORD */}
          <TabsContent value="security">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ganti Password</h2>
                <p className="text-sm text-gray-500">Pastikan menggunakan password yang aman.</p>
              </div>
              <PasswordForm />
            </div>
          </TabsContent>

          {/* TAB 4: RIWAYAT LAPORAN */}
          <TabsContent value="history">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Riwayat Laporan</h2>
                <p className="text-sm text-gray-500">Daftar semua laporan yang pernah Anda buat.</p>
              </div>
              <HistoryTable reports={user.reports} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}