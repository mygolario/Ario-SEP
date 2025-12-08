"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListTodo, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GenerateExecutionPlanButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}/execution-plan`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to generate plan");

      toast.success("برنامه اجرایی شما با موفقیت ساخته شد!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("خطا در ساخت برنامه. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold" size="lg">
      {loading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          در حال ساخت برنامه اجرا...
        </>
      ) : (
        <>
          <ListTodo className="ml-2 h-5 w-5" />
          ساخت برنامه اجرای اولیه با هوش مصنوعی
        </>
      )}
    </Button>
  );
}
