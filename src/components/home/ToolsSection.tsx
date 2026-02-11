"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    AlignLeft, QrCode, Lock, Braces, Receipt, Type, Timer,
    ArrowRightLeft, GitCompare, FileType, Search, Image as ImageIcon,
    Palette, Smartphone, Award, FileText, UserSquare, FileImage,
    Link as LinkIcon, Files, Eraser, PenTool, Binary, Fingerprint, Eye, Database
} from "lucide-react";
import { Input } from "@/components/ui/input";

const TOOLS = [
    {
        id: "word-counter",
        title: "Word Counter",
        desc: "Hitung jumlah kata, karakter, dan estimasi waktu baca.",
        icon: AlignLeft,
        color: "teal",
        href: "/tools/word-counter"
    },
    {
        id: "qr-generator",
        title: "QR Generator",
        desc: "Bikin QR Code custom wara-wiri buat link/wifi.",
        icon: QrCode,
        color: "indigo",
        href: "/tools/qr-generator"
    },
    {
        id: "password-generator",
        title: "Password Generator",
        desc: "Password kuat anti-bobol untuk keamanan akun.",
        icon: Lock,
        color: "rose",
        href: "/tools/password-generator"
    },
    {
        id: "json-formatter",
        title: "JSON Formatter",
        desc: "Beautify & Validate JSON yang berantakan.",
        icon: Braces,
        color: "amber",
        href: "/tools/json-formatter"
    },
    {
        id: "invoice-generator",
        title: "Invoice Generator",
        desc: "Buat invoice profesional & download PDF.",
        icon: Receipt,
        color: "violet",
        href: "/tools/invoice-generator"
    },
    {
        id: "case-converter",
        title: "Case Converter",
        desc: "UPPERCASE, lowercase, Title Case converter.",
        icon: Type,
        color: "blue",
        href: "/tools/case-converter"
    },
    {
        id: "pomodoro",
        title: "Pomodoro Timer",
        desc: "Focus timer biar gak burn out.",
        icon: Timer,
        color: "red",
        href: "/tools/pomodoro"
    },
    {
        id: "unit-converter",
        title: "Unit Converter",
        desc: "Konversi Panjang, Berat, Suhu sat-set.",
        icon: ArrowRightLeft,
        color: "cyan",
        href: "/tools/unit-converter"
    },
    {
        id: "diff-checker",
        title: "Diff Checker",
        desc: "Bandingkan 2 teks, cari bedanya dimana.",
        icon: GitCompare,
        color: "orange",
        href: "/tools/diff-checker"
    },
    {
        id: "lorem-generator",
        title: "Lorem Generator",
        desc: "Generate dummy text filler.",
        icon: FileType,
        color: "gray",
        href: "/tools/lorem-generator"
    },
    // NEW TOOLS
    {
        id: "image-compressor",
        title: "Image Compressor",
        desc: "Kompres gambar JPG/PNG tanpa kurangi kualitas.",
        icon: ImageIcon,
        color: "pink",
        href: "/tools/image-compressor"
    },
    {
        id: "color-converter",
        title: "Color Converter",
        desc: "Convert HEX, RGB, HSL dengan mudah.",
        icon: Palette,
        color: "emerald",
        href: "/tools/color-converter"
    },
    // NEW BATCH 3 TOOLS
    {
        id: "base64-converter",
        title: "Base64 Converter",
        desc: "Encode & Decode Base64 string.",
        icon: Binary,
        color: "blue",
        href: "/tools/base64-converter"
    },
    {
        id: "url-encoder",
        title: "URL Encoder",
        desc: "Encode URL special chars biar aman.",
        icon: LinkIcon,
        color: "purple",
        href: "/tools/url-encoder"
    },
    {
        id: "uuid-generator",
        title: "UUID Generator",
        desc: "Generate random UUID v4 bulk.",
        icon: Fingerprint,
        color: "emerald", // Reusing emerald/green
        href: "/tools/uuid-generator"
    },
    {
        id: "markdown-preview",
        title: "Markdown Preview",
        desc: "Live editor & preview markdown.",
        icon: Eye,
        color: "slate",
        href: "/tools/markdown-preview"
    },
    {
        id: "sql-formatter",
        title: "SQL Formatter",
        desc: "Beautify SQL Query yang berantakan.",
        icon: Database,
        color: "orange",
        href: "/tools/sql-formatter"
    },
    // RESTORED MISSING TOOLS
    {
        id: "certificate",
        title: "Certificate Generator",
        desc: "Buat sertifikat profesional otomatis.",
        icon: Award,
        color: "yellow",
        href: "/tools/certificate"
    },
    {
        id: "cover-letter",
        title: "Cover Letter Generator",
        desc: "Bikin surat lamaran kerja yang menarik HRD.",
        icon: FileText,
        color: "slate",
        href: "/tools/cover-letter"
    },
    {
        id: "cv-builder",
        title: "CV Builder",
        desc: "Buat CV ATS-friendly dengan cepat.",
        icon: UserSquare,
        color: "lime",
        href: "/tools/cv-builder"
    },
    {
        id: "image-to-pdf",
        title: "Image to PDF",
        desc: "Ubah banyak gambar jadi satu file PDF.",
        icon: FileImage,
        color: "crimson",
        href: "/tools/image-to-pdf"
    },
    {
        id: "link-shortener",
        title: "Link Shortener",
        desc: "Perpendek link panjang biar enak dishare.",
        icon: LinkIcon,
        color: "blue",
        href: "/tools/link-shortener"
    },
    {
        id: "pdf-merger",
        title: "PDF Merger",
        desc: "Gabungkan banyak file PDF jadi satu.",
        icon: Files,
        color: "orange",
        href: "/tools/pdf-merger"
    },
    {
        id: "remove-bg",
        title: "Remove Background",
        desc: "Hapus background foto otomatis pakai AI.",
        icon: Eraser,
        color: "purple",
        href: "/tools/remove-bg"
    },
    {
        id: "signature",
        title: "Signature Generator",
        desc: "Bikin tanda tangan digital yang smooth.",
        icon: PenTool,
        color: "gray",
        href: "/tools/signature"
    }
];

export default function ToolsSection() {
    const { status } = useSession();
    const isLoggedIn = status === "authenticated";
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTools = TOOLS.filter(tool =>
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getColorClasses = (color: string) => {
        const colors: Record<string, { text: string, bg: string, border: string }> = {
            teal: { text: "text-teal-600", bg: "bg-teal-50", border: "group-hover:text-teal-600" },
            indigo: { text: "text-indigo-600", bg: "bg-indigo-50", border: "group-hover:text-indigo-600" },
            rose: { text: "text-rose-600", bg: "bg-rose-50", border: "group-hover:text-rose-600" },
            amber: { text: "text-amber-600", bg: "bg-amber-50", border: "group-hover:text-amber-600" },
            violet: { text: "text-violet-600", bg: "bg-violet-50", border: "group-hover:text-violet-600" },
            blue: { text: "text-blue-600", bg: "bg-blue-50", border: "group-hover:text-blue-600" },
            red: { text: "text-red-600", bg: "bg-red-50", border: "group-hover:text-red-600" },
            cyan: { text: "text-cyan-600", bg: "bg-cyan-50", border: "group-hover:text-cyan-600" },
            orange: { text: "text-orange-600", bg: "bg-orange-50", border: "group-hover:text-orange-600" },
            gray: { text: "text-gray-600", bg: "bg-gray-50", border: "group-hover:text-gray-600" },
            pink: { text: "text-pink-600", bg: "bg-pink-50", border: "group-hover:text-pink-600" },
            emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "group-hover:text-emerald-600" },
            yellow: { text: "text-yellow-600", bg: "bg-yellow-50", border: "group-hover:text-yellow-600" },
            slate: { text: "text-slate-600", bg: "bg-slate-50", border: "group-hover:text-slate-600" },
            lime: { text: "text-lime-600", bg: "bg-lime-50", border: "group-hover:text-lime-600" },
            crimson: { text: "text-rose-700", bg: "bg-rose-50", border: "group-hover:text-rose-700" },
            purple: { text: "text-purple-600", bg: "bg-purple-50", border: "group-hover:text-purple-600" }
        };
        return colors[color] || colors.gray;
    };

    return (
        <section className="py-20" id="tools">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Tools Productivity</h2>
                    <p className="text-slate-500 max-w-xl mx-auto mb-8">
                        Kumpulan tools sakti untuk nemenin ngoding & nugas.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Cari tools..."
                            className="pl-10 h-12 rounded-2xl bg-white/50 border-white/20 backdrop-blur-sm focus:bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => {
                            const styles = getColorClasses(tool.color);
                            const Icon = tool.icon;

                            return (
                                <Link key={tool.id} href={tool.href} className="glass-card p-6 rounded-2xl group relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Icon className={`h-24 w-24 ${styles.text}`} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className={`mb-4 inline-flex p-3 rounded-xl ${styles.bg} ${styles.text}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className={`text-lg font-bold mb-2 transition-colors ${styles.border}`}>{tool.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{tool.desc}</p>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <div className="mb-4 inline-flex p-4 rounded-full bg-gray-100">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <p>Yahh, tools yang kamu cari belum ada nich.</p>
                            <p className="text-sm mt-1">Coba cari keyword lain atau request tools baru!</p>
                        </div>
                    )}
                </div>

                {!isLoggedIn && (
                    <div className="text-center mt-12">
                        <Link href="/register">
                            <button className="rounded-full px-8 py-3 bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all font-medium text-sm">
                                Daftar Gratis untuk Akses Semua
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
