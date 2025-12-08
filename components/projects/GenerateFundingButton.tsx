"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function GenerateFundingButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/funding-roadmap`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate funding roadmap");
      }

      toast({
        title: "نقشه راه مالی آماده شد",
        description: "اکنون می‌توانید استراتژی و برنامه جذب سرمایه را مشاهده کنید.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در تولید نقشه راه پیش آمد. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          در حال تدوین استراتژی مالی...
        </>
      ) : (
        <>
          <DollarSign className="ml-2 h-5 w-5" />
          ساخت نقشه راه جذب سرمایه با هوش مصنوعی
        </>
      )}
    </Button>
  );
}
