"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Import plugin tabel
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"; // Pakai oneLight biar lebih mirip kertas
import { saveAs } from "file-saver";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  id: string;
  title: string;
  subject: string; 
  studentName: string;
  studentId: string;
  class: string;
  lecturer: string;
  practiceDate: Date;
  generatedReport: string;
  // Data institusi dari User profile
  prodi?: string;
  departemen?: string;
  institusi?: string;
}

export default function ReportPreview({ report }: { report: ReportData }) {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to clean duplicate header information from generated report
  const cleanGeneratedReport = (content: string) => {
    // Remove common duplicate patterns that appear in AI generated reports
    const patterns = [
      // Remove course info block
      /^Mata Kuliah\s*:\s*.*?\n/gim,
      /^Judul Praktikum\s*:\s*.*?\n/gim, 
      /^Mahasiswa\s*:\s*.*?\n/gim,
      /^Kelas\s*:\s*.*?\n/gim,
      /^Dosen\s*:\s*.*?\n/gim,
      /^Tanggal\s*:\s*.*?\n/gim,
      // Remove multiple consecutive newlines after cleaning
      /\n{3,}/g
    ];
    
    let cleanedContent = content;
    patterns.forEach((pattern, index) => {
      if (index < patterns.length - 1) {
        cleanedContent = cleanedContent.replace(pattern, '');
      } else {
        // Last pattern - replace multiple newlines with double newline
        cleanedContent = cleanedContent.replace(pattern, '\n\n');
      }
    });
    
    // Remove leading whitespace/newlines
    cleanedContent = cleanedContent.trim();
    
    return cleanedContent;
  };

  const handleDownloadWord = async () => {
    if (!reportRef.current) return;

    try {
      setIsDownloading(true);
      toast({
        title: "Sedang memproses Word...",
        description: "Mohon tunggu sebentar.",
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = reportRef.current;
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Remove buttons and unnecessary elements
      const buttons = clonedElement.querySelectorAll('button, svg');
      buttons.forEach(btn => btn.remove());

      // Rebuild HTML struktur manual untuk Word (hapus semua Tailwind classes)
      const coverDiv = clonedElement.querySelector('[style*="330mm"]');
      const contentDiv = clonedElement.querySelectorAll('[style*="330mm"]')[1];
      
      // Extract data dari cover
      const studentName = report.studentName;
      const studentClass = report.class;
      const studentId = report.studentId;
      const title = report.title;
      const subject = report.subject;
      const lecturer = report.lecturer || "Yanuar Risah Prayogi";
      const prodi = report.prodi || 'PROGRAM STUDI SARJANA TERAPAN TEKNIK INFORMATIKA';
      const departemen = report.departemen || 'DEPARTEMEN TEKNIK INFORMATIKA DAN KOMPUTER';
      const institusi = report.institusi || 'POLITEKNIK ELEKTRONIKA NEGERI SURABAYA';
      
      // Extract content dari markdown dan clean up (tapi pertahankan struktur)
      let markdownContent = contentDiv?.querySelector('.prose')?.innerHTML || cleanGeneratedReport(report.generatedReport);
      
      // Hanya hapus attributes yang benar-benar tidak perlu, pertahankan struktur HTML
      markdownContent = markdownContent
        .replace(/class="[^"]*"/g, '') // Hapus class attributes
        .replace(/node="[^"]*"/g, '') // Hapus node attributes
        .replace(/style="break-inside:[^"]*"/g, ''); // Hapus break-inside aja

      // Buat HTML Word dengan manual structure (no Tailwind)
      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan ${title}</title>
          <style>
            @page {
              size: 210mm 330mm;
              margin: 30mm 25mm;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: black;
            }
            
            /* COVER PAGE STYLES */
            .cover-page {
              height: 330mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 30mm 25mm;
            }
            
            .cover-header {
              margin-top: 30px;
              margin-bottom: 40px;
              width: 100%;
              text-align: center;
            }
            
            .cover-header h1 {
              font-size: 18pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 20px;
            }
            
            .cover-header h2 {
              font-size: 20pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 20px;
              line-height: 1.5;
              border: none !important; /* Hapus border di cover */
            }
            
            .cover-header p {
              font-size: 13pt;
              margin: 10px 0;
              text-align: center;
            }
            
            .cover-logo {
              margin: auto 0;
              text-align: center;
            }
            
            .cover-logo img {
              width: 30px;
              height: 30px;
            }
            
            .cover-identity {
              width: 100%;
              margin-top: 50px;
              margin-bottom: 60px;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            
            .identity-content {
              display: inline-block;
              text-align: center;
              margin: 0 auto;
            }
            
            .identity-content p {
              margin: 8px 0;
              font-size: 13pt;
              line-height: 2;
              text-align: center;
            }
            
            .identity-content span:first-child {
              display: inline-block;
              width: 100px;
              font-weight: 500;
            }
            
            .identity-content span:nth-child(2) {
              display: inline-block;
              width: 20px;
              text-align: center;
            }
            
            .cover-footer {
              margin-top: auto;
              margin-bottom: 30px;
              font-weight: bold;
              font-size: 11pt;
              text-transform: uppercase;
              line-height: 1.8;
              text-align: center;
              width: 100%;
            }
            
            .cover-footer p {
              margin: 5px 0;
              text-align: center;
            }
            
            /* CONTENT PAGE STYLES */
            .content-page {
              min-height: 330mm;
              padding: 30mm 25mm;
              border-top: 4px double #ccc;
            }
            
            .content-header {
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 2px solid black;
            }
            
            .content-header h3 {
              font-size: 15pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            /* Typography */
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Times New Roman', serif;
              color: black;
              font-weight: bold;
            }
            
            h2 {
              font-size: 14pt;
              font-weight: bold;
              text-transform: uppercase;
              border-bottom: 2px solid #999;
              padding-bottom: 8px;
              margin-top: 48px;
              margin-bottom: 16px;
              page-break-after: avoid;
            }
            
            h3 {
              font-size: 12pt;
              font-weight: bold;
              margin-top: 32px;
              margin-bottom: 12px;
              border-left: 4px solid #ccc;
              padding-left: 12px;
              page-break-after: avoid;
            }
            
            h4 {
              font-size: 12pt;
              font-weight: 600;
              margin-top: 24px;
              margin-bottom: 8px;
            }
            
            p {
              text-align: justify;
              margin-bottom: 12pt;
              line-height: 1.6;
              color: black;
            }
            
            strong {
              font-weight: bold;
              color: black;
            }
            
            em {
              font-style: italic;
            }
            
            /* Code Block */
            pre {
              background-color: #fafafa !important;
              padding: 14px;
              font-family: 'Courier New', monospace;
              font-size: 9pt;
              line-height: 1.5;
              white-space: pre-wrap;
              word-wrap: break-word;
              color: #333;
              margin: 20px 0;
              border: 1px solid #ddd;
            }
            
            code {
              font-family: 'Courier New', monospace;
              background-color: #f0f0f0;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10pt;
              color: #c7254e;
              font-weight: bold;
            }
            
            pre code {
              background: transparent;
              padding: 0;
              color: inherit;
              font-weight: normal;
            }
            
            /* Table */
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 24px 0;
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid black;
              padding: 8px 12px;
              text-align: left;
              vertical-align: top;
              font-size: 11pt;
            }
            
            th {
              background-color: #d0d0d0;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            /* List */
            ul, ol {
              margin: 16px 0;
              padding-left: 40px;
            }
            
            li {
              margin-bottom: 8px;
              line-height: 1.6;
              color: black;
            }
            
            /* Blockquote */
            blockquote {
              border-left: 4px solid #999;
              padding: 12px 16px;
              margin: 16px 0;
              font-style: italic;
              background-color: #f5f5f5;
              color: #555;
            }
            
            /* Horizontal Rule */
            hr {
              border: none;
              border-top: 2px solid #ccc;
              margin: 32px 0;
            }
            
            /* Page break control */
            .report-question-section {
              page-break-inside: avoid;
              margin-bottom: 48px;
            }
            
            .avoid-page-break {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <!-- COVER PAGE -->
          <div class="cover-page">
            <div class="cover-header">
              <h1>LAPORAN RESMI</h1>
              <h2>${title}</h2>
              <p style="font-weight: 500;">Mata Kuliah: ${subject}</p>
              <p>Dosen Pengampu: ${lecturer}</p>
            </div>
            
            <div class="cover-logo">
              <img src="https://upload.wikimedia.org/wikipedia/id/4/44/Logo_PENS.png" alt="Logo PENS" style="width: 30px; height: 30px;" />
            </div>
            
            <div class="cover-identity">
              <div class="identity-content">
                <p><span>Nama</span> <span>:</span> <span style="text-transform: uppercase;">${studentName}</span></p>
                <p><span>Kelas</span> <span>:</span> <span style="text-transform: uppercase;">${studentClass}</span></p>
                <p><span>NRP</span> <span>:</span> <span>${studentId}</span></p>
              </div>
            </div>
            
            <div class="cover-footer">
              <p>${prodi || 'PROGRAM STUDI SARJANA TERAPAN TEKNIK INFORMATIKA'}</p>
              <p>${departemen || 'DEPARTEMEN TEKNIK INFORMATIKA DAN KOMPUTER'}</p>
              <p>${institusi || 'POLITEKNIK ELEKTRONIKA NEGERI SURABAYA'}</p>
              <p style="margin-top: 10px;">${new Date().getFullYear()}</p>
            </div>
          </div>
          
          <!-- CONTENT PAGE -->
          <div class="content-page">
            <div class="content-header">
              <h3>PRAKTIKUM: ${title}</h3>
            </div>
            
            <div class="prose">
              ${markdownContent}
            </div>
          </div>
        </body>
        </html>
      `;

      // Convert HTML ke Blob
      const blob = new Blob([fullHTML], {
        type: "application/msword"
      });

      const cleanName = report.studentName.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `Laporan_${report.studentId}_${cleanName}.doc`;

      saveAs(blob, fileName);

      toast({
        title: "Berhasil!",
        description: `Word "${fileName}" telah didownload.`,
      });

    } catch (error) {
      console.error("Word Export Error:", error);
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal membuat Word. Coba lagi.",
      });
    } finally {
      setIsDownloading(false);
    }
  };



  return (
    <div className="space-y-6 pb-20">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/95 backdrop-blur p-4 sticky top-14 z-40 border-b shadow-sm">
        <Link href="/create">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Buat Baru
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button onClick={handleDownloadWord} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Download Word
          </Button>
        </div>
      </div>

      {/* Area Laporan (Kertas F4) */}
      <div className="flex justify-center bg-slate-100 dark:bg-slate-900 py-8 px-4 min-h-screen overflow-auto">
        <Card 
          ref={reportRef} 
          className="w-[210mm] bg-white text-black shadow-2xl print:shadow-none"
          style={{ minHeight: 'auto' }}
        >
          {/* ================= COVER PAGE F4 ================= */}
          <div className="p-[25mm] pt-[30mm] pb-[30mm] flex flex-col items-center text-center relative" style={{ height: '330mm' }}>
            
            {/* Header Judul */}
            <div className="mt-8 mb-10 w-full">
              <h1 className="text-xl font-bold uppercase tracking-wide mb-4">LAPORAN RESMI</h1>
              <h2 className="text-2xl font-bold uppercase mb-4 leading-relaxed px-4">{report.title}</h2>
              <p className="text-base font-medium mt-6">Mata Kuliah: {report.subject}</p>
              <p className="text-base">Dosen Pengampu: {report.lecturer || "Yanuar Risah Prayogi"}</p>
            </div>

            {/* Logo PENS */}
            <div className="my-auto flex flex-col items-center justify-center">
               {/* Ganti src ini dengan URL logo PENS png yang valid/lokal */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src="https://upload.wikimedia.org/wikipedia/id/4/44/Logo_PENS.png" 
                 alt="Logo PENS" 
                 className="w-40 h-40 object-contain drop-shadow-sm"
                 onError={(e) => {
                    // Fallback jika gambar gagal load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-32 h-32 flex items-center justify-center border-4 border-black rounded-full font-bold">LOGO PENS</div>';
                 }}
               />
            </div>

            {/* Identitas Mahasiswa (CENTERED BLOCK) */}
            {/* Menggunakan mx-auto pada container div agar bloknya di tengah, tapi text-left agar rapi */}
            <div className="w-full mt-12 mb-16 flex justify-center">
              <div className="grid grid-cols-[100px_20px_1fr] gap-y-2 text-left font-medium text-base w-fit min-w-[300px]">
                <div>Nama</div> <div>:</div> <div className="uppercase">{report.studentName}</div>
                <div>Kelas</div> <div>:</div> <div className="uppercase">{report.class}</div>
                <div>NRP</div> <div>:</div> <div>{report.studentId}</div>
              </div>
            </div>

            {/* Footer Cover */}
            <div className="mt-auto mb-8 font-bold text-sm uppercase leading-relaxed text-gray-800">
              <p>{report.prodi || 'PROGRAM STUDI SARJANA TERAPAN TEKNIK INFORMATIKA'}</p>
              <p>{report.departemen || 'DEPARTEMEN TEKNIK INFORMATIKA DAN KOMPUTER'}</p>
              <p>{report.institusi || 'POLITEKNIK ELEKTRONIKA NEGERI SURABAYA'}</p>
              <p className="mt-2">{new Date().getFullYear()}</p>
            </div>
            
          </div>

          {/* ================= ISI LAPORAN ================= */}
          <div className="p-[25mm] pt-[30mm] pb-[30mm] border-t-4 border-double border-gray-300 print:border-none" style={{ minHeight: '330mm' }}>
            {/* Header Halaman Isi */}
            <div className="mb-8 border-b-2 border-black pb-2">
               <h3 className="font-bold text-lg uppercase tracking-wide">PRAKTIKUM: {report.title}</h3>
            </div>

            {/* Konten Markdown */}
            <div className="prose max-w-none prose-sm prose-slate font-serif text-justify text-black">
              <Markdown
                remarkPlugins={[remarkGfm]} // Plugin Tabel aktif
                components={{
                  // 1. Custom Table Renderer (Supaya rapi ada garisnya)
                  table({ children }) {
                    return (
                      <div className="my-6 w-full overflow-x-auto">
                        <table className="w-full border-collapse border border-black text-sm">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead({ children }) {
                    return <thead className="bg-gray-200 text-black font-bold uppercase">{children}</thead>;
                  },
                  th({ children }) {
                    return <th className="border border-black px-3 py-2 text-center align-middle">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="border border-black px-3 py-2 align-top">{children}</td>;
                  },
                  
                  // 2. Custom Code Block (Supaya syntax highlight jalan)
                  code(props) {
                    const {children, className, node, ref, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    
                    // Jika code block (ada bahasanya)
                    return match ? (
                      <div className="my-6 border border-gray-300 rounded overflow-hidden shadow-md text-xs avoid-page-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300 font-mono text-gray-700 text-[10px] font-semibold uppercase">
                          <span>{match[1]} SOURCE CODE</span>
                        </div>
                        <SyntaxHighlighter
                          PreTag="div"
                          children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={oneLight}
                          customStyle={{ 
                            margin: 0, 
                            borderRadius: 0, 
                            fontSize: '0.7rem', 
                            lineHeight: '1.5',
                            padding: '14px',
                            maxHeight: 'none',
                            backgroundColor: '#fafafa'
                          }}
                          wrapLines={true}
                          wrapLongLines={true}
                        />
                      </div>
                    ) : (
                      // Jika inline code
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-red-700 font-mono text-xs font-bold">
                        {children}
                      </code>
                    )
                  },

                  // 3. Custom Headers (Agar sesuai format A, B, C)
                  h2(props) {
                     return (
                       <div className="report-question-section mt-12 mb-6 pt-8 border-t-2 border-gray-300 first:border-0 first:mt-0 first:pt-0">
                         <h2 className="text-base font-bold uppercase border-b-2 border-gray-400 pb-2" {...props} />
                       </div>
                     )
                  },
                  h3(props) {
                     return <h3 className="text-sm font-bold mt-8 mb-3 text-black avoid-page-break border-l-4 border-gray-300 pl-3" {...props} />
                  },
                  p(props) {
                    return <p className="mb-4 leading-relaxed text-black text-justify" {...props} />
                  },
                  // Handle blockquote sebagai Analisa/Catatan
                  blockquote(props) {
                    return <blockquote className="border-l-4 border-gray-400 pl-4 italic bg-gray-50 p-3 my-4 text-gray-700 rounded-sm" {...props} />
                  },
                  // Tambah styling untuk strong (bold text)
                  strong(props) {
                    return <strong className="font-bold text-black" {...props} />
                  },
                  // List styling
                  ul(props) {
                    return <ul className="my-4 ml-6 list-disc space-y-2" {...props} />
                  },
                  ol(props) {
                    return <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />
                  },
                  li(props) {
                    return <li className="text-black leading-relaxed" {...props} />
                  },
                  // Horizontal rule untuk pemisah
                  hr(props) {
                    return <hr className="my-8 border-t-2 border-gray-300" {...props} />
                  }
                }}
              >
                {cleanGeneratedReport(report.generatedReport)}
              </Markdown>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}