import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        
        {/* Bagian Kiri: Copyright */}
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AI Laporan Generator. Built by{" "}
            <a
              href="https://github.com/muhammadahnaf"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Muhammad Ahnaf
            </a>
            .
          </p>
        </div>

        {/* Bagian Kanan: Feedback Button */}
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Ada kendala?
          </p>
          <FeedbackDialog />
        </div>
      </div>
    </footer>
  );
}