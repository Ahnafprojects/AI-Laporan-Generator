import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, Crown, DollarSign, Clock, TrendingUp, Ticket } from "lucide-react";
import AdminTables from "@/components/admin/AdminTables";

export const dynamic = 'force-dynamic'; // Agar data selalu fresh

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/");
  }

  // DATA STATISTIK
  const totalUsers = await prisma.user.count();
  const totalReports = await prisma.report.count();
  
  // PRO USER STATISTICS
  const proUsersCount = await prisma.user.count({
    where: {
      AND: [
        { isPro: true },
        { proExpiresAt: { gte: new Date() } }
      ]
    }
  });
  
  const expiredProCount = await prisma.user.count({
    where: {
      AND: [
        { isPro: false },
        { proExpiresAt: { lt: new Date() } }
      ]
    }
  });

  // Revenue dari transaksi PRO (hanya yang sukses)
  const totalRevenue = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { status: "settlement" }
  });

  // PRO users yang akan expire dalam 7 hari
  const expiringProUsers = await prisma.user.count({
    where: {
      AND: [
        { proExpiresAt: { gte: new Date() } },
        { proExpiresAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
      ]
    }
  });

  // AI TOOLS USAGE STATISTICS
  const totalAIUsage = await prisma.dailyUsage.aggregate({
    _sum: { usageCount: true }
  });

  const todayAIUsage = await prisma.dailyUsage.aggregate({
    _sum: { usageCount: true },
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  // Top AI users
  const topAIUsers = await prisma.user.findMany({
    select: {
      email: true,
      isPro: true,
      dailyUsages: {
        select: {
          usageCount: true
        }
      }
    },
    take: 10
  });

  // Calculate total AI usage per user
  const topAIUsersWithTotal = topAIUsers.map(user => ({
    email: user.email,
    isPro: user.isPro,
    totalUsage: user.dailyUsages.reduce((sum, usage) => sum + usage.usageCount, 0)
  })).filter(user => user.totalUsage > 0)
    .sort((a, b) => b.totalUsage - a.totalUsage)
    .slice(0, 5);

  // Users yang menggunakan redeem code (assuming we track this in transactions)
  const redeemCodeUsage = await prisma.transaction.count({
    where: { 
      orderId: { startsWith: "REDEEM_" },
      status: "settlement"
    }
  });

  // Monthly vs Yearly breakdown (berdasarkan transaction history)
  const monthlySubscribers = await prisma.transaction.count({
    where: {
      AND: [
        { orderId: { contains: "PRO-MONTHLY" } },
        { status: "settlement" }
      ]
    }
  });

  const yearlySubscribers = await prisma.transaction.count({
    where: {
      AND: [
        { orderId: { contains: "PRO-YEARLY" } },
        { status: "settlement" }
      ]
    }
  });

  // Revenue breakdown
  const monthlyRevenue = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      AND: [
        { orderId: { contains: "PRO-MONTHLY" } },
        { status: "settlement" }
      ]
    }
  });

  const yearlyRevenue = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      AND: [
        { orderId: { contains: "PRO-YEARLY" } },
        { status: "settlement" }
      ]
    }
  });
  
  // 1. DATA USER (Ambil 50 terbaru dengan PRO status)
  const users = await prisma.user.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      nrp: true,
      kelas: true,
      createdAt: true,
      isPro: true,
      proExpiresAt: true,
      _count: { select: { reports: true } },
    },
  });

  // 2. DATA LAPORAN (Ambil 50 terbaru)
  const reports = await prisma.report.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, nrp: true }
      }
    }
  });

  // 3. DATA FEEDBACK (Ambil 50 terbaru)
  const feedbacks = await prisma.feedback.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Panel Moderasi & Monitoring.</p>
        </div>
        <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
          SUPER ADMIN MODE
        </div>
      </div>

      {/* KARTU STATISTIK - Enhanced with PRO monitoring */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((proUsersCount / totalUsers) * 100)}% PRO users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PRO Users</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{proUsersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp {totalRevenue._sum.amount?.toLocaleString('id-ID') || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From PRO subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeem Codes</CardTitle>
            <Ticket className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{redeemCodeUsage}</div>
            <p className="text-xs text-muted-foreground mt-1">Codes redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringProUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Generated reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ACTIVE</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* PRO USER INSIGHTS */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              PRO User Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active PRO Users:</span>
                <span className="font-semibold text-green-600">{proUsersCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expired PRO Users:</span>
                <span className="font-semibold text-red-600">{expiredProCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Free Users:</span>
                <span className="font-semibold">{totalUsers - proUsersCount - expiredProCount}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                <span className="font-semibold text-blue-600">
                  {Math.round(((proUsersCount + expiredProCount) / totalUsers) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Plan Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Subscribers:</span>
                <span className="font-semibold text-blue-600">{monthlySubscribers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yearly Subscribers:</span>
                <span className="font-semibold text-yellow-600">{yearlySubscribers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Redeem Codes Used:</span>
                <span className="font-semibold text-purple-600">{redeemCodeUsage}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Yearly Preference:</span>
                <span className="font-semibold text-green-600">
                  {monthlySubscribers + yearlySubscribers > 0 
                    ? Math.round((yearlySubscribers / (monthlySubscribers + yearlySubscribers)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Revenue:</span>
                <span className="font-semibold text-blue-600">
                  Rp {monthlyRevenue._sum.amount?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yearly Revenue:</span>
                <span className="font-semibold text-yellow-600">
                  Rp {yearlyRevenue._sum.amount?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Revenue:</span>
                <span className="font-semibold text-green-600">
                  Rp {totalRevenue._sum.amount?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Renewal Risk:</span>
                <span className="font-semibold text-orange-600">{expiringProUsers} users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI TOOLS USAGE ANALYTICS */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              AI Tools Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total AI Requests:</span>
                <span className="font-semibold text-purple-600">{totalAIUsage._sum.usageCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today's Usage:</span>
                <span className="font-semibold text-blue-600">{todayAIUsage._sum.usageCount || 0}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Avg per User:</span>
                <span className="font-semibold text-green-600">
                  {totalUsers > 0 ? Math.round((totalAIUsage._sum.usageCount || 0) / totalUsers) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Top AI Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topAIUsersWithTotal.length > 0 ? topAIUsersWithTotal.map((user, index) => (
                <div key={user.email} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[200px]">
                    {user.email} {user.isPro && '👑'}
                  </span>
                  <span className="font-semibold">{user.totalUsage}x</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No AI usage yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-indigo-600" />
              Rate Limiting Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Limit (Free):</span>
                <span className="font-semibold text-indigo-600">3 requests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">PRO Users:</span>
                <span className="font-semibold text-yellow-600">Unlimited ∞</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Cost Savings:</span>
                <span className="font-semibold text-green-600">
                  ${Math.round((totalAIUsage._sum.usageCount || 0) * 0.001)} saved
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABEL INTERAKTIF (USER & REPORT) */}
      <AdminTables initialUsers={users} initialReports={reports} initialFeedbacks={feedbacks} />
    </div>
  );
}