"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus, Star, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast({ variant: "destructive", title: "Pilih Bintang", description: "Mohon berikan rating bintang 1-5." });
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      });

      if (!res.ok) throw new Error("Gagal mengirim");

      toast({ title: "Terima Kasih!", description: "Masukan Anda sangat berharga bagi kami." });
      setOpen(false); // Tutup modal
      setRating(0); // Reset form
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengirim masukan." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Beri Masukan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kirim Masukan / Lapor Bug</DialogTitle>
          <DialogDescription>
            Ada fitur yang error? Atau punya ide fitur baru? Ceritakan kepada kami!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-2">
          {/* RATING BINTANG */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Seberapa puas Anda?</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-all hover:scale-110 focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-transparent text-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INPUT PESAN */}
          <div className="space-y-2">
            <Textarea
              name="message"
              required
              placeholder="Contoh: Bang, tombol download-nya error pas diklik..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Kirim Masukan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}