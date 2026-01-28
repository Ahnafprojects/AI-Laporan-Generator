import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { Crown, Mail, Shield, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl mt-auto relative z-10">
      <div className="container py-12 px-4 md:px-8 mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 h-6 w-6 text-purple-400 opacity-50 animate-pulse blur-sm"></div>
                {/* Reusing Sparkles icon concept logic if import allows or just visually similar */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-6 w-6 text-violet-600 transition-transform group-hover:rotate-12"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                SmartLabs
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered report generator untuk mahasiswa.
              Buat laporan praktikum berkualitas dengan teknologi terdepan.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 hover:text-violet-600 transition-colors">
              <Mail className="h-4 w-4" />
              <span>smartlabseepis@gmail.com</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/create" className="hover:text-violet-600 transition-colors">
                  Generator Laporan
                </Link>
              </li>
              <li>
                <Link href="/upgrade" className="hover:text-violet-600 transition-colors">
                  Upgrade PRO
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-violet-600 transition-colors">
                  Profile & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <div className="hover:text-violet-600 transition-colors w-fit">
                  <FeedbackDialog />
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/terms" className="hover:text-violet-600 transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-violet-600 transition-colors flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SmartLabs. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-4 md:mt-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span>System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );

}