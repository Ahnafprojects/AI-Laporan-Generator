import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { Crown, Mail, Shield, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950 mt-auto">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h3 className="font-bold text-lg">SmartLabs</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered report generator untuk mahasiswa. 
              Buat laporan praktikum berkualitas dengan teknologi terdepan.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>smartlabseepis@gmail.com</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/create" className="hover:text-foreground transition-colors">
                  Generator Laporan
                </Link>
              </li>
              <li>
                <Link href="/upgrade" className="hover:text-foreground transition-colors">
                  Upgrade PRO
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground transition-colors">
                  Profile & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <FeedbackDialog />
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SmartLabs. All rights reserved.
            </p>
          
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-4 md:mt-0">
             <span>•</span>
            <span>SaaS Platform</span>
            <span>•</span>
            <span>AI-Powered</span>
          
          </div>
        </div>
      </div>
    </footer>
  );
}