"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Trash2, Loader2, FileText, UserX, Search, ChevronLeft, ChevronRight, MessageSquare, Star, Crown, Filter, Database, Activity, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminTables({ initialUsers, initialReports, initialFeedbacks }: { initialUsers: any[], initialReports: any[], initialFeedbacks: any[] }) {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [reports, setReports] = useState(initialReports);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // States untuk search
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("");
  
  // States untuk filter PRO users
  const [userFilter, setUserFilter] = useState<"all" | "pro" | "free" | "expired">("all");
  
  // States untuk pagination
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [reportCurrentPage, setReportCurrentPage] = useState(1);
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATABASE USAGE STATS
  const fetchDbStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/database-stats");
      if (res.ok) {
        const stats = await res.json();
        setDbStats(stats);
      }
    } catch (error) {
      console.error("Error fetching DB stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load stats on mount
  useEffect(() => {
    fetchDbStats();
  }, []);

  // FUNGSI HAPUS USER
  const handleDeleteUser = async (userId: string) => {
    setDeletingId(userId);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        body: JSON.stringify({ id: userId }),
      });
      if (!res.ok) throw new Error("Gagal");
      
      // Update UI langsung tanpa refresh
      setUsers(users.filter(u => u.id !== userId));
      toast({ title: "User Dihapus", description: "User dan laporannya telah dihapus permanen." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menghapus user." });
    } finally {
      setDeletingId(null);
    }
  };

  // FUNGSI UPDATE STATUS USER (FREE/PRO MONTHLY/PRO YEARLY)
  const handleUpdateUserStatus = async (userId: string, userEmail: string, newStatus: 'free' | 'monthly' | 'yearly') => {
    setUpgradingId(userId);
    try {
      let endpoint = "";
      let body = {};
      
      if (newStatus === 'free') {
        // Downgrade ke FREE
        endpoint = "/api/admin/downgrade-user";
        body = { userId, email: userEmail };
      } else {
        // Upgrade ke PRO
        endpoint = "/api/payment/manual-activate";
        body = { 
          email: userEmail, 
          paymentId: `admin-${newStatus}-${Date.now()}`,
          plan: newStatus
        };
      }
      
      const res = await fetch(endpoint, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) throw new Error("Gagal update status");
      
      const result = await res.json();
      
      // Update user di state
      setUsers(users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isPro: newStatus !== 'free', 
              proExpiresAt: newStatus === 'free' ? null : result.expiresAt 
            }
          : u
      ));
      
      const statusText = {
        'free': 'FREE',
        'monthly': 'PRO Monthly (30 hari)',
        'yearly': 'PRO Yearly (365 hari)'
      };
      
      toast({ 
        title: "Status Diupdate!", 
        description: `User berhasil diubah ke ${statusText[newStatus]}` 
      });
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Gagal mengubah status user." 
      });
    } finally {
      setUpgradingId(null);
    }
  };

  // FUNGSI HAPUS LAPORAN
  const handleDeleteReport = async (reportId: string) => {
    setDeletingId(reportId);
    try {
      const res = await fetch("/api/admin/delete-report", {
        method: "DELETE",
        body: JSON.stringify({ id: reportId }),
      });
      if (!res.ok) throw new Error("Gagal");
      
      setReports(reports.filter(r => r.id !== reportId));
      toast({ title: "Laporan Dihapus", description: "Laporan berhasil dihapus." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menghapus laporan." });
    } finally {
      setDeletingId(null);
    }
  };

  // FILTERED DATA dengan search dan filter PRO
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = userSearchTerm.toLowerCase();
      const matchesSearch = (
        user.name?.toLowerCase().includes(searchLower) ||
        user.nrp?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.kelas?.toLowerCase().includes(searchLower)
      );

      // Filter berdasarkan status PRO
      const now = new Date();
      const isActivePro = user.proExpiresAt && new Date(user.proExpiresAt) > now;
      const isExpiredPro = user.proExpiresAt && new Date(user.proExpiresAt) <= now && !user.isPro;
      const isFree = !user.proExpiresAt || (!isActivePro && !isExpiredPro);

      let matchesFilter = true;
      switch (userFilter) {
        case "pro":
          matchesFilter = isActivePro;
          break;
        case "expired":
          matchesFilter = isExpiredPro;
          break;
        case "free":
          matchesFilter = isFree;
          break;
        case "all":
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [users, userSearchTerm, userFilter]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchLower = reportSearchTerm.toLowerCase();
      return (
        report.title.toLowerCase().includes(searchLower) ||
        report.subject?.toLowerCase().includes(searchLower) ||
        report.user.name?.toLowerCase().includes(searchLower) ||
        report.user.nrp?.toLowerCase().includes(searchLower)
      );
    });
  }, [reports, reportSearchTerm]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const searchLower = feedbackSearchTerm.toLowerCase();
      return (
        feedback.message.toLowerCase().includes(searchLower) ||
        feedback.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [feedbacks, feedbackSearchTerm]);

  // PAGINATED DATA
  const paginatedUsers = useMemo(() => {
    const startIndex = (userCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, userCurrentPage]);

  const paginatedReports = useMemo(() => {
    const startIndex = (reportCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, reportCurrentPage]);

  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (feedbackCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFeedbacks.slice(startIndex, endIndex);
  }, [filteredFeedbacks, feedbackCurrentPage]);

  // PAGINATION INFO
  const userTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const reportTotalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const feedbackTotalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // PAGINATION HANDLERS
  const handleUserPageChange = (page: number) => {
    setUserCurrentPage(page);
  };

  const handleReportPageChange = (page: number) => {
    setReportCurrentPage(page);
  };

  const handleFeedbackPageChange = (page: number) => {
    setFeedbackCurrentPage(page);
  };

  // Reset pagination when search changes
  const handleUserSearch = (value: string) => {
    setUserSearchTerm(value);
    setUserCurrentPage(1);
  };

  const handleUserFilter = (filter: "all" | "pro" | "free" | "expired") => {
    setUserFilter(filter);
    setUserCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
  };

  const handleReportSearch = (value: string) => {
    setReportSearchTerm(value);
    setReportCurrentPage(1);
  };

  const handleFeedbackSearch = (value: string) => {
    setFeedbackSearchTerm(value);
    setFeedbackCurrentPage(1);
  };

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Daftar User ({filteredUsers.length})</TabsTrigger>
        <TabsTrigger value="reports">Daftar Laporan ({filteredReports.length})</TabsTrigger>
        <TabsTrigger value="feedbacks">Masukan ({filteredFeedbacks.length})</TabsTrigger>
        <TabsTrigger value="database">Database Usage</TabsTrigger>
      </TabsList>

      {/* TAB MANAGE USER */}
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Manajemen Pengguna</CardTitle>
              <div className="flex items-center space-x-3">
                {/* Filter PRO Status */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={userFilter} onValueChange={handleUserFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="pro">PRO Active</SelectItem>
                      <SelectItem value="expired">PRO Expired</SelectItem>
                      <SelectItem value="free">Free User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama, NRP, email, atau kelas..."
                    value={userSearchTerm}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage AI</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => {
                      const now = new Date();
                      const isActivePro = user.proExpiresAt && new Date(user.proExpiresAt) > now;
                      const isExpiredPro = user.proExpiresAt && new Date(user.proExpiresAt) <= now && !user.isPro;
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                            <div className="text-xs text-muted-foreground">{user.nrp}</div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.kelas}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {isActivePro ? (
                                <>
                                  <Crown className="h-4 w-4 text-yellow-600" />
                                  <span className="text-yellow-600 font-semibold text-sm">PRO</span>
                                  <div className="text-xs text-muted-foreground">
                                    Exp: {format(new Date(user.proExpiresAt), "dd/MM/yy", { locale: idLocale })}
                                  </div>
                                </>
                              ) : isExpiredPro ? (
                                <>
                                  <Crown className="h-4 w-4 text-gray-400" />
                                  <span className="text-red-600 font-semibold text-sm">EXPIRED</span>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(user.proExpiresAt), "dd/MM/yy", { locale: idLocale })}
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-600 text-sm">FREE</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{user._count.reports} Laporan</div>
                              <div className="text-xs text-muted-foreground">
                                Daily: {user.dailyUsage || 0}/50
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(new Date(user.createdAt), "dd/MM/yy", { locale: idLocale })}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(user.createdAt), "HH:mm", { locale: idLocale })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {/* STATUS MANAGEMENT BUTTONS */}
                              {isActivePro ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleUpdateUserStatus(user.id, user.email, 'free')}
                                  disabled={upgradingId === user.id}
                                  className="text-xs px-2 h-7"
                                >
                                  {upgradingId === user.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    "→ FREE"
                                  )}
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => handleUpdateUserStatus(user.id, user.email, 'monthly')}
                                    disabled={upgradingId === user.id}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 h-7"
                                  >
                                    {upgradingId === user.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      "PRO 30d"
                                    )}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => handleUpdateUserStatus(user.id, user.email, 'yearly')}
                                    disabled={upgradingId === user.id}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs px-2 h-7"
                                  >
                                    {upgradingId === user.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      "PRO 1y"
                                    )}
                                  </Button>
                                </>
                              )}
                              
                              {/* ALERT DIALOG BIAR GA SALAH HAPUS */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" disabled={deletingId === user.id}>
                                    {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus User {user.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Ini akan menghapus akun user DAN SEMUA LAPORAN yang pernah dia buat secara permanen. Tindakan tidak bisa dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                                      Ya, Musnahkan
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                        </TableCell>
                      </TableRow>
                    );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {userSearchTerm ? "Tidak ada pengguna yang cocok dengan pencarian." : "Tidak ada pengguna."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* PAGINATION USERS */}
              {userTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {((userCurrentPage - 1) * itemsPerPage) + 1} - {Math.min(userCurrentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} pengguna
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserPageChange(userCurrentPage - 1)}
                      disabled={userCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, userTotalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={userCurrentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUserPageChange(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {userTotalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant={userCurrentPage === userTotalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUserPageChange(userTotalPages)}
                            className="w-8 h-8"
                          >
                            {userTotalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserPageChange(userCurrentPage + 1)}
                      disabled={userCurrentPage === userTotalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB MANAGE REPORTS */}
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Laporan Terbaru</CardTitle>
              <div className="flex items-center space-x-2 max-w-sm">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari judul, mata kuliah, atau mahasiswa..."
                  value={reportSearchTerm}
                  onChange={(e) => handleReportSearch(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Praktikum</TableHead>
                    <TableHead>Mahasiswa</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.title}
                          <div className="text-xs text-muted-foreground">{report.subject}</div>
                        </TableCell>
                        <TableCell>
                          {report.user.name}
                          <div className="text-xs text-muted-foreground">{report.user.nrp}</div>
                        </TableCell>
                        <TableCell>{format(new Date(report.createdAt), "dd MMM yyyy", { locale: idLocale })}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === report.id}
                          >
                             {deletingId === report.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {reportSearchTerm ? "Tidak ada laporan yang cocok dengan pencarian." : "Tidak ada laporan."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* PAGINATION REPORTS */}
              {reportTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {((reportCurrentPage - 1) * itemsPerPage) + 1} - {Math.min(reportCurrentPage * itemsPerPage, filteredReports.length)} dari {filteredReports.length} laporan
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReportPageChange(reportCurrentPage - 1)}
                      disabled={reportCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, reportTotalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={reportCurrentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleReportPageChange(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {reportTotalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant={reportCurrentPage === reportTotalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleReportPageChange(reportTotalPages)}
                            className="w-8 h-8"
                          >
                            {reportTotalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReportPageChange(reportCurrentPage + 1)}
                      disabled={reportCurrentPage === reportTotalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB MANAGE FEEDBACKS */}
      <TabsContent value="feedbacks">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Masukan & Laporan Bug</CardTitle>
              <div className="flex items-center space-x-2 max-w-sm">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pesan atau email..."
                  value={feedbackSearchTerm}
                  onChange={(e) => handleFeedbackSearch(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rating</TableHead>
                    <TableHead>Pesan</TableHead>
                    <TableHead>User (Opsional)</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFeedbacks.length > 0 ? (
                    paginatedFeedbacks.map((fb) => (
                      <TableRow key={fb.id}>
                        <TableCell>
                          <div className="flex text-yellow-500">
                            {/* Render Bintang */}
                            {Array.from({ length: fb.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate" title={fb.message}>
                          {fb.message}
                        </TableCell>
                        <TableCell>
                          {fb.email ? <span className="text-green-600 font-medium">Terdaftar</span> : <span className="text-slate-400 italic">Anonim</span>}
                        </TableCell>
                        <TableCell>{format(new Date(fb.createdAt), "dd MMM yyyy", { locale: idLocale })}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {feedbackSearchTerm ? "Tidak ada feedback yang cocok dengan pencarian." : "Tidak ada feedback."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* PAGINATION FEEDBACKS */}
              {feedbackTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {((feedbackCurrentPage - 1) * itemsPerPage) + 1} - {Math.min(feedbackCurrentPage * itemsPerPage, filteredFeedbacks.length)} dari {filteredFeedbacks.length} feedback
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeedbackPageChange(feedbackCurrentPage - 1)}
                      disabled={feedbackCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, feedbackTotalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={feedbackCurrentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeedbackPageChange(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {feedbackTotalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant={feedbackCurrentPage === feedbackTotalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeedbackPageChange(feedbackTotalPages)}
                            className="w-8 h-8"
                          >
                            {feedbackTotalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeedbackPageChange(feedbackCurrentPage + 1)}
                      disabled={feedbackCurrentPage === feedbackTotalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB DATABASE USAGE */}
      <TabsContent value="database">
        <div className="grid gap-6">
          {/* Header dengan Refresh Button */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Usage & Statistics
                </CardTitle>
                <Button onClick={fetchDbStats} disabled={loadingStats} variant="outline" size="sm">
                  {loadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                  Refresh Stats
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          {dbStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Table Counts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Database Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Users:</span>
                      <span className="font-medium">{dbStats.tables?.users || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reports:</span>
                      <span className="font-medium">{dbStats.tables?.reports || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transactions:</span>
                      <span className="font-medium">{dbStats.tables?.transactions || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Feedbacks:</span>
                      <span className="font-medium">{dbStats.tables?.feedbacks || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">New Users:</span>
                      <span className="font-medium text-green-600">{dbStats.activity?.todayUsers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reports Gen:</span>
                      <span className="font-medium text-blue-600">{dbStats.activity?.todayReports || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PRO Users:</span>
                      <span className="font-medium text-yellow-600">{dbStats.activity?.proUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Database Usage */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Database Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Est. Queries:</span>
                      <span className="font-medium">{dbStats.usage?.estimatedQueries?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg/User:</span>
                      <span className="font-medium">{dbStats.usage?.avgQueriesPerUser || 0}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * Estimated based on app usage patterns
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cloud Provider Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Cloud Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Provider:</span>
                      <span className="font-medium">Neon/Postgres</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Monitor usage in provider dashboard for accurate limits & billing.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top AI Users */}
          {dbStats?.usage?.topUsers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top AI Users (Most Reports Generated)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dbStats.usage.topUsers.map((user: any, index: number) => (
                    <div key={user.email} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">{user._count.reports}</span>
                        <span className="text-sm text-gray-500">reports</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
