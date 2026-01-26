"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, ArrowRight, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface Report {
  id: string;
  title: string;
  subject: string;
  practiceDate: Date;
  lecturer?: string;
  createdAt: Date;
}

export default function HistoryTable({ reports: initialReports }: { reports: Report[] }) {
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, reportId: string, reportTitle: string}>({
    isOpen: false,
    reportId: '',
    reportTitle: ''
  });
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  // Filter reports berdasarkan search query
  const filteredReports = useMemo(() => {
    if (!searchQuery) return reports;
    
    return reports.filter(report => 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.lecturer?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Delete report function
  const handleDeleteReport = async (reportId: string, reportTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      reportId,
      reportTitle
    });
  };

  const confirmDelete = async () => {
    const { reportId, reportTitle } = deleteDialog;
    setIsDeleting(reportId);
    
    try {
      const response = await fetch("/api/reports/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus laporan");
      }

      // Remove from local state
      setReports(prev => prev.filter(r => r.id !== reportId));
      
      toast({
        title: "Berhasil!",
        description: "Laporan telah dihapus.",
      });

      // Reset pagination if current page becomes empty
      const newFilteredCount = filteredReports.length - 1;
      const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error instanceof Error ? error.message : "Gagal menghapus laporan",
      });
    } finally {
      setIsDeleting(null);
      setDeleteDialog({ isOpen: false, reportId: '', reportTitle: '' });
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Belum ada riwayat laporan.</p>
        <Link href="/create">
          <Button variant="link">Buat laporan pertama sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Cari laporan berdasarkan judul, mata kuliah, atau dosen..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Info */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredReports.length} dari {reports.length} laporan
        </p>
      )}

      {/* Reports List */}
      {currentReports.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>Tidak ada laporan yang ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentReports.map((report) => (
            <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-1">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.subject}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-xs text-gray-500 mt-2">
                        <span>Praktikum: {format(new Date(report.practiceDate), "dd MMM yyyy", { locale: idLocale })}</span>
                        <span>Dosen: {report.lecturer || "Tidak disebutkan"}</span>
                        <span>Dibuat: {format(new Date(report.createdAt), "dd MMM yyyy HH:mm", { locale: idLocale })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link href={`/preview/${report.id}`} className="flex-1 sm:flex-none">
                      <Button className="w-full sm:w-auto" size="sm">
                        Buka <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReport(report.id, report.title)}
                      disabled={isDeleting === report.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isDeleting === report.id ? (
                        <div className="h-4 w-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages} ({filteredReports.length} laporan)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, reportId: '', reportTitle: '' })}
        onConfirm={confirmDelete}
        title={deleteDialog.reportTitle}
        isLoading={isDeleting === deleteDialog.reportId}
      />
    </>
  );
}