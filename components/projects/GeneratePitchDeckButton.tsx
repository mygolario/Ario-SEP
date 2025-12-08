"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Presentation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function GeneratePitchDeckButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/pitch-deck`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate pitch deck");
      }

      toast({
        title: "طرح ارائه آماده شد",
        description: "اکنون می‌توانید ساختار پیشنهادی اسلایدها را مشاهده کنید.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در تولید طرح ارائه پیش آمد. لطفا دوباره تلاش کنید.",
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
          در حال ساخت طرح ارائه با هوش مصنوعی...
        </>
      ) : (
        <>
          <Presentation className="ml-2 h-5 w-5" />
          ساخت طرح ارائه با هوش مصنوعی
        </>
      )}
    </Button>
  );
}
