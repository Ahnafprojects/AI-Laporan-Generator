"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CancelSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payment/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Gagal membatalkan subscription");
      }

      toast({
        title: "Subscription Dibatalkan",
        description: "Membership PRO Anda akan berakhir sesuai tanggal yang telah ditentukan. Terima kasih telah menggunakan layanan PRO!",
      });

      // Refresh halaman untuk update status
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membatalkan subscription. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Berhenti Langganan"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan Membership PRO?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan kehilangan akses ke fitur PRO setelah periode berlangganan berakhir. 
            Membership tetap aktif hingga tanggal berakhir yang telah ditentukan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tetap Berlangganan</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelSubscription}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            Ya, Batalkan Membership
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}