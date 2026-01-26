import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Shield, Clock, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container py-10 min-h-screen max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Syarat & Ketentuan</h1>
        <p className="text-muted-foreground">
          Ketentuan penggunaan AI Laporan Generator dan disclaimer penting.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Disclaimer AI */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Penting: Disclaimer AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-amber-900 dark:text-amber-100">
            <p>
              <strong>Aplikasi ini menggunakan teknologi AI (Artificial Intelligence)</strong> untuk membantu menghasilkan laporan praktikum.
            </p>
            <div className="space-y-2">
              <p><strong>Yang perlu Anda ketahui:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>AI dapat menghasilkan kesalahan atau "halusinasi" (informasi yang tidak akurat)</li>
                <li>Hasil generate adalah <strong>alat bantu referensi</strong>, bukan pengganti belajar</li>
                <li>Mahasiswa <strong>wajib mengecek ulang</strong> seluruh isi laporan sebelum dikumpulkan</li>
                <li>Kami tidak bertanggung jawab atas nilai atau hasil akademik yang diperoleh</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Kuota & Pembatasan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Kuota & Pembatasan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Kuota Harian</h4>
              <p>Setiap pengguna dibatasi maksimal <strong>5 laporan per hari</strong> untuk memastikan penggunaan yang wajar dan mencegah penyalahgunaan sistem.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reset Kuota</h4>
              <p>Kuota akan reset otomatis setiap hari pada pukul 00:00 WIB.</p>
            </div>
          </CardContent>
        </Card>

        {/* Penggunaan Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privasi & Keamanan Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Data yang Disimpan</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Data profil mahasiswa (nama, NRP, kelas, institusi)</li>
                <li>Riwayat laporan yang pernah dibuat</li>
                <li>Kode dan konten yang diupload untuk generate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Keamanan</h4>
              <p>Data Anda disimpan dengan aman dan hanya dapat diakses oleh Anda sendiri. Kami tidak membagikan data pribadi kepada pihak ketiga.</p>
            </div>
          </CardContent>
        </Card>

        {/* Tanggung Jawab Pengguna */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tanggung Jawab Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Kewajiban Mahasiswa</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Memahami dan mempelajari materi praktikum secara mandiri</li>
                <li>Menggunakan hasil generate sebagai referensi, bukan untuk disalin mentah-mentah</li>
                <li>Melakukan verifikasi dan koreksi terhadap semua informasi dalam laporan</li>
                <li>Bertanggung jawab penuh atas isi laporan yang dikumpulkan</li>
                <li>Mematuhi aturan akademik institusi masing-masing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Larangan</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Menyalahgunakan sistem untuk tujuan non-akademik</li>
                <li>Membagikan akun atau hasil generate kepada orang lain</li>
                <li>Menggunakan untuk ujian atau tugas yang dilarang menggunakan alat bantu AI</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan di atas.</p>
          <p className="mt-2">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

      </div>
    </div>
  );
}