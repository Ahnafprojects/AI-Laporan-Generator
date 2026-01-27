import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Database, Cookie } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-center">Kebijakan Privasi</h1>
        <p className="text-muted-foreground text-center mb-8">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-6">
          {/* 1. Informasi yang Kami Kumpulkan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                1. Informasi yang Kami Kumpulkan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Akun:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nama lengkap dan NRP mahasiswa</li>
                  <li>Alamat email untuk login dan notifikasi</li>
                  <li>Kelas dan informasi akademik</li>
                  <li>Password (disimpan dalam bentuk hash/encrypted)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Penggunaan:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Laporan yang dihasilkan dan konten input</li>
                  <li>Waktu dan frekuensi penggunaan layanan</li>
                  <li>Status membership (FREE/PRO)</li>
                  <li>Data transaksi pembayaran melalui Saweria</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Teknis:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Alamat IP dan informasi perangkat</li>
                  <li>Browser dan sistem operasi</li>
                  <li>Log aktivitas untuk debugging dan keamanan</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 2. Bagaimana Kami Menggunakan Informasi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                2. Bagaimana Kami Menggunakan Informasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Kami menggunakan informasi Anda untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Penyediaan Layanan:</strong> Menghasilkan laporan, autentikasi akun, dan fitur core aplikasi</li>
                <li><strong>Personalisasi:</strong> Menyimpan preferensi dan history laporan Anda</li>
                <li><strong>Komunikasi:</strong> Mengirim notifikasi sistem, update, dan support</li>
                <li><strong>Pembayaran:</strong> Memproses upgrade ke PRO dan verifikasi pembayaran</li>
                <li><strong>Keamanan:</strong> Deteksi aktivitas mencurigakan dan spam</li>
                <li><strong>Analytics:</strong> Memahami pola penggunaan untuk pengembangan fitur</li>
                <li><strong>Compliance:</strong> Memenuhi persyaratan hukum dan regulasi</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Penyimpanan Data */}
          <Card>
            <CardHeader>
              <CardTitle>3. Penyimpanan & Keamanan Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Lokasi Penyimpanan:</h4>
                <p>Data disimpan di server cloud yang aman (Neon Database, Netlify) dengan enkripsi dan backup otomatis.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Keamanan:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Password di-hash menggunakan algoritma bcrypt</li>
                  <li>Koneksi HTTPS untuk semua komunikasi</li>
                  <li>Akses database terbatas dan termonitor</li>
                  <li>Regular security updates dan monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Retensi Data:</h4>
                <p>Data akun disimpan selama akun aktif. Data laporan disimpan hingga pengguna menghapus atau 2 tahun tidak aktif.</p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Berbagi Data dengan Pihak Ketiga */}
          <Card>
            <CardHeader>
              <CardTitle>4. Berbagi Data dengan Pihak Ketiga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Kami TIDAK menjual data pribadi Anda. Data dapat dibagikan dalam kondisi terbatas:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>AI Provider (Groq):</strong> Input laporan untuk processing AI (tidak menyimpan data pribadi)</li>
                <li><strong>Payment Processor (Saweria):</strong> Data transaksi untuk verifikasi pembayaran PRO</li>
                <li><strong>Cloud Infrastructure:</strong> Neon Database, Netlify untuk hosting dan database</li>
                <li><strong>Analytics:</strong> Data usage yang di-anonymize untuk improvement</li>
                <li><strong>Legal Compliance:</strong> Jika diwajibkan oleh hukum atau regulasi</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Cookies & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                5. Cookies & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Kami menggunakan cookies dan teknologi tracking untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Session login, preferensi, keamanan (diperlukan untuk fungsi dasar)</li>
                <li><strong>Analytics:</strong> Google Analytics atau similar untuk memahami penggunaan (dapat di-disable)</li>
                <li><strong>Performance:</strong> Monitoring performa dan error tracking</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Anda dapat mengatur cookies di browser, namun menonaktifkan essential cookies dapat mengganggu fungsi website.
              </p>
            </CardContent>
          </Card>

          {/* 6. Hak Pengguna */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. Hak-Hak Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Akses:</strong> Melihat data pribadi yang kami simpan tentang Anda</li>
                <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki data yang tidak akurat</li>
                <li><strong>Penghapusan:</strong> Menghapus akun dan data terkait (right to be forgotten)</li>
                <li><strong>Portabilitas:</strong> Export data dalam format yang dapat dibaca</li>
                <li><strong>Keberatan:</strong> Menolak penggunaan data untuk tujuan tertentu</li>
                <li><strong>Pembatasan:</strong> Membatasi pemrosesan data dalam kondisi tertentu</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email atau fitur feedback di website.
              </p>
            </CardContent>
          </Card>

          {/* 7. Perubahan Kebijakan */}
          <Card>
            <CardHeader>
              <CardTitle>7. Perubahan Kebijakan Privasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan material akan dinotifikasi melalui:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email notification ke semua pengguna aktif</li>
                <li>Banner notification di website</li>
                <li>Update tanggal "Terakhir diperbarui" di halaman ini</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru.
              </p>
            </CardContent>
          </Card>

          {/* 8. Data Anak-Anak */}
          <Card>
            <CardHeader>
              <CardTitle>8. Privasi Anak-Anak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Layanan ini ditujukan untuk mahasiswa PENS (umumnya 18+ tahun). Kami tidak secara sengaja mengumpulkan 
                data dari anak-anak di bawah 13 tahun. Jika orang tua mengetahui bahwa anak mereka memberikan data 
                pribadi, silakan hubungi kami untuk penghapusan segera.
              </p>
            </CardContent>
          </Card>

          {/* 9. Kontak */}
          <Card>
            <CardHeader>
              <CardTitle>9. Hubungi Kami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin menggunakan hak-hak Anda:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> privacy@smartlabseepis.com</li>
                <li><strong>Feedback:</strong> Gunakan tombol feedback di website</li>
                <li><strong>Website:</strong> smartlabseepis.netlify.app</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Kami berkomitmen untuk merespons pertanyaan privasi dalam waktu 7 hari kerja.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Dengan menggunakan layanan Smart Lab SEEPIS, Anda menyetujui pengumpulan dan penggunaan 
            informasi sesuai dengan kebijakan privasi ini.
          </p>
        </div>
      </div>
    </div>
  );
}