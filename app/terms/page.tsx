import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, Calendar, User, Shield, CreditCard, Ban, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Smart Lab SEEPIS",
  description: "Terms of Service untuk AI-powered report generator Smart Lab SEEPIS. Ketentuan penggunaan platform, hak dan kewajiban pengguna, kebijakan pembayaran, dan aturan layanan.",
  keywords: ["terms of service", "ketentuan layanan", "syarat penggunaan", "AI laporan generator", "Smart Lab SEEPIS", "PENS"],
  openGraph: {
    title: "Terms of Service - Smart Lab SEEPIS",
    description: "Syarat dan ketentuan penggunaan platform AI-powered report generator untuk mahasiswa PENS",
    type: "website",
  },
};

export default function TermsPage() {
  const lastUpdated = "26 Januari 2025";

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Diperbarui: {lastUpdated}</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <FileText className="h-10 w-10 text-blue-500" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Syarat dan ketentuan penggunaan platform AI-powered report generator Smart Lab SEEPIS
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Isi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a href="#acceptance" className="hover:text-primary transition-colors">1. Penerimaan Ketentuan</a>
          <a href="#description" className="hover:text-primary transition-colors">2. Deskripsi Layanan</a>
          <a href="#eligibility" className="hover:text-primary transition-colors">3. Kelayakan Pengguna</a>
          <a href="#account" className="hover:text-primary transition-colors">4. Akun Pengguna</a>
          <a href="#usage" className="hover:text-primary transition-colors">5. Penggunaan Platform</a>
          <a href="#payment" className="hover:text-primary transition-colors">6. Pembayaran & Langganan</a>
          <a href="#content" className="hover:text-primary transition-colors">7. Konten Pengguna</a>
          <a href="#intellectual" className="hover:text-primary transition-colors">8. Hak Kekayaan Intelektual</a>
          <a href="#prohibited" className="hover:text-primary transition-colors">9. Aktivitas Terlarang</a>
          <a href="#termination" className="hover:text-primary transition-colors">10. Penghentian Layanan</a>
          <a href="#disclaimer" className="hover:text-primary transition-colors">11. Penafian Jaminan</a>
          <a href="#limitation" className="hover:text-primary transition-colors">12. Pembatasan Tanggung Jawab</a>
          <a href="#indemnification" className="hover:text-primary transition-colors">13. Ganti Rugi</a>
          <a href="#changes" className="hover:text-primary transition-colors">14. Perubahan Ketentuan</a>
          <a href="#governing" className="hover:text-primary transition-colors">15. Hukum yang Berlaku</a>
          <a href="#contact" className="hover:text-primary transition-colors">16. Kontak</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        
        {/* Section 1 */}
        <section id="acceptance" className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-3">
            <FileCheck className="h-6 w-6 text-green-500" />
            <span>1. Penerimaan Ketentuan</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Dengan mengakses dan menggunakan platform Smart Lab SEEPIS ("Layanan"), Anda menyetujui 
              untuk terikat dengan Syarat dan Ketentuan ini ("Ketentuan"). Jika Anda tidak setuju dengan 
              ketentuan ini, Anda tidak diperkenankan menggunakan Layanan kami.
            </p>
            <p>
              Ketentuan ini merupakan perjanjian yang mengikat secara hukum antara Anda dan Smart Lab SEEPIS 
              terkait penggunaan platform AI-powered report generator kami.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="description" className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Deskripsi Layanan</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Smart Lab SEEPIS adalah platform Software as a Service (SaaS) yang menyediakan layanan 
              pembuatan laporan praktikum otomatis menggunakan teknologi Artificial Intelligence (AI) 
              untuk mahasiswa Politeknik Elektronika Negeri Surabaya (PENS).
            </p>
            <p>Layanan yang kami sediakan meliputi:</p>
            <ul>
              <li>Generator laporan praktikum berbasis AI</li>
              <li>Template laporan yang disesuaikan dengan standar PENS</li>
              <li>Upload gambar dan dokumentasi praktikum</li>
              <li>Riwayat laporan yang telah dibuat</li>
              <li>Fitur premium dengan kuota tambahan dan prioritas</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="eligibility" className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-500" />
            <span>3. Kelayakan Pengguna</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Untuk menggunakan Layanan ini, Anda harus:</p>
            <ul>
              <li>Berusia minimal 17 tahun atau memiliki izin orang tua/wali</li>
              <li>Menjadi mahasiswa aktif Politeknik Elektronika Negeri Surabaya (PENS)</li>
              <li>Memiliki kapasitas hukum untuk membuat perjanjian yang mengikat</li>
              <li>Memberikan informasi yang akurat dan terkini saat registrasi</li>
              <li>Mematuhi semua hukum dan peraturan yang berlaku</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="account" className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Akun Pengguna</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Anda bertanggung jawab untuk menjaga keamanan akun Anda, termasuk username dan password. 
              Anda setuju untuk:
            </p>
            <ul>
              <li>Menjaga kerahasiaan kredensial login Anda</li>
              <li>Tidak membagikan akses akun kepada pihak lain</li>
              <li>Segera memberitahu kami jika terjadi penggunaan tidak sah pada akun Anda</li>
              <li>Bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
            </ul>
            <p>
              Kami berhak menangguhkan atau menghentikan akun yang melanggar ketentuan ini.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="usage" className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Penggunaan Platform</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Anda diperbolehkan menggunakan platform ini untuk:</p>
            <ul>
              <li>Membuat laporan praktikum untuk keperluan akademik yang sah</li>
              <li>Mengakses fitur-fitur yang tersedia sesuai dengan tipe akun Anda</li>
              <li>Menyimpan dan mengelola riwayat laporan Anda</li>
            </ul>
            <p>
              <strong>Penting:</strong> Platform ini dirancang sebagai alat bantu pembelajaran. 
              Anda tetap bertanggung jawab untuk memastikan akurasi dan keaslian konten laporan 
              yang dihasilkan. Gunakan output AI sebagai referensi dan sesuaikan dengan 
              kebutuhan praktikum Anda.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="payment" className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-green-500" />
            <span>6. Pembayaran & Langganan</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h3>6.1 Tipe Akun</h3>
            <ul>
              <li><strong>FREE:</strong> Kuota terbatas per hari</li>
              <li><strong>PRO Monthly:</strong> Kuota unlimited dengan pembayaran bulanan</li>
              <li><strong>PRO Yearly:</strong> Kuota unlimited dengan pembayaran tahunan (diskon)</li>
            </ul>
            
            <h3>6.2 Pembayaran</h3>
            <ul>
              <li>Pembayaran dilakukan melalui gateway Saweria</li>
              <li>Harga dapat berubah sewaktu-waktu dengan pemberitahuan sebelumnya</li>
              <li>Pembayaran tidak dapat dikembalikan setelah diproses</li>
              <li>Upgrade akun bersifat otomatis setelah pembayaran terverifikasi</li>
            </ul>

            <h3>6.3 Kode Redeem</h3>
            <p>
              Kami menyediakan sistem kode redeem untuk promosi dan testing. Kode redeem 
              memiliki masa berlaku dan syarat penggunaan tertentu.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="content" className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Konten Pengguna</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Dengan mengupload konten (teks, gambar, atau file lainnya) ke platform kami, 
              Anda menyatakan bahwa:
            </p>
            <ul>
              <li>Anda memiliki hak untuk menggunakan dan membagikan konten tersebut</li>
              <li>Konten tidak melanggar hak kekayaan intelektual pihak lain</li>
              <li>Konten tidak mengandung materi yang ilegal, berbahaya, atau tidak pantas</li>
            </ul>
            <p>
              Kami berhak menghapus konten yang melanggar ketentuan ini tanpa pemberitahuan.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="intellectual" className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-3">
            <Shield className="h-6 w-6 text-purple-500" />
            <span>8. Hak Kekayaan Intelektual</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Semua hak kekayaan intelektual terkait platform Smart Lab SEEPIS, termasuk 
              namun tidak terbatas pada kode sumber, desain, logo, dan merek dagang, 
              adalah milik kami atau pemberi lisensi kami.
            </p>
            <p>
              Laporan yang dihasilkan oleh platform tetap menjadi milik Anda, namun 
              Anda memberikan kami hak untuk memproses dan menyimpan data tersebut 
              untuk keperluan operasional layanan.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="prohibited" className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-3">
            <Ban className="h-6 w-6 text-red-500" />
            <span>9. Aktivitas Terlarang</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Anda dilarang untuk:</p>
            <ul>
              <li>Menggunakan platform untuk tujuan yang ilegal atau tidak etis</li>
              <li>Mencoba mengakses sistem atau data yang tidak diotorisasi</li>
              <li>Menggunakan bot, script, atau otomasi untuk mengakses layanan</li>
              <li>Membagikan atau menjual akses akun kepada pihak lain</li>
              <li>Mengganggu atau merusak operasi normal platform</li>
              <li>Menggunakan platform untuk plagiarisme atau kecurangan akademik</li>
              <li>Mengupload konten yang mengandung virus atau malware</li>
            </ul>
          </div>
        </section>

        {/* Section 10 */}
        <section id="termination" className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Penghentian Layanan</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Kami berhak menghentikan atau menangguhkan akses Anda ke layanan kami, 
              dengan atau tanpa pemberitahuan, jika:
            </p>
            <ul>
              <li>Anda melanggar ketentuan ini</li>
              <li>Anda menggunakan layanan untuk aktivitas yang ilegal</li>
              <li>Kami perlu melakukan pemeliharaan atau upgrade sistem</li>
              <li>Diperlukan untuk melindungi keamanan platform dan pengguna lain</li>
            </ul>
            <p>
              Anda dapat menghentikan akun Anda kapan saja melalui pengaturan profil 
              atau dengan menghubungi kami.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="disclaimer" className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Penafian Jaminan</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Layanan kami disediakan "sebagaimana adanya" tanpa jaminan apapun. 
              Kami tidak menjamin bahwa:
            </p>
            <ul>
              <li>Layanan akan selalu tersedia atau bebas dari gangguan</li>
              <li>Output AI akan selalu akurat atau sesuai dengan kebutuhan Anda</li>
              <li>Platform bebas dari bug atau error</li>
              <li>Keamanan data akan selalu terjamin 100%</li>
            </ul>
          </div>
        </section>

        {/* Section 12 */}
        <section id="limitation" className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Pembatasan Tanggung Jawab</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Dalam batas yang diizinkan hukum, kami tidak bertanggung jawab atas:
            </p>
            <ul>
              <li>Kerugian tidak langsung, insidental, atau konsekuensial</li>
              <li>Kehilangan data atau kerusakan sistem</li>
              <li>Gangguan layanan atau downtime</li>
              <li>Kerugian akibat penggunaan output AI yang tidak tepat</li>
            </ul>
            <p>
              Total tanggung jawab kami tidak akan melebihi jumlah yang Anda bayarkan 
              kepada kami dalam 12 bulan terakhir.
            </p>
          </div>
        </section>

        {/* Section 13 */}
        <section id="indemnification" className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Ganti Rugi</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Anda setuju untuk melindungi dan membebaskan kami dari segala klaim, 
              tuntutan, atau kerugian yang timbul dari:
            </p>
            <ul>
              <li>Pelanggaran terhadap ketentuan ini</li>
              <li>Penggunaan layanan yang tidak sesuai</li>
              <li>Pelanggaran hak pihak ketiga</li>
              <li>Konten yang Anda upload atau bagikan</li>
            </ul>
          </div>
        </section>

        {/* Section 14 */}
        <section id="changes" className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Perubahan Ketentuan</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Kami berhak mengubah ketentuan ini kapan saja. Perubahan akan 
              diberitahukan melalui:
            </p>
            <ul>
              <li>Notifikasi di platform</li>
              <li>Email ke alamat yang terdaftar</li>
              <li>Pengumuman di halaman utama</li>
            </ul>
            <p>
              Penggunaan berkelanjutan atas layanan setelah perubahan ketentuan 
              menunjukkan persetujuan Anda terhadap ketentuan yang baru.
            </p>
          </div>
        </section>

        {/* Section 15 */}
        <section id="governing" className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Hukum yang Berlaku</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum 
              Republik Indonesia. Setiap sengketa akan diselesaikan melalui 
              pengadilan yang berwenang di Surabaya, Jawa Timur.
            </p>
          </div>
        </section>

        {/* Section 16 */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Kontak</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami melalui:
            </p>
            <ul>
              <li><strong>Email:</strong> support@smartlabseepis.com</li>
              <li><strong>GitHub:</strong> <a href="https://github.com/Ahnafprojects/AI-Laporan-Generator" target="_blank" rel="noopener noreferrer">AI-Laporan-Generator Repository</a></li>
              <li><strong>Feedback:</strong> Gunakan fitur feedback yang tersedia di platform</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Dengan menggunakan Smart Lab SEEPIS, Anda menyetujui Ketentuan Layanan ini
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
          <Link 
            href="/privacy" 
            className="text-primary hover:underline flex items-center space-x-1"
          >
            <Shield className="h-4 w-4" />
            <span>Privacy Policy</span>
          </Link>
          <span className="hidden md:inline text-muted-foreground">•</span>
          <Link 
            href="/" 
            className="text-primary hover:underline"
          >
            Kembali ke Platform
          </Link>
        </div>
      </div>
    </div>
  );
}