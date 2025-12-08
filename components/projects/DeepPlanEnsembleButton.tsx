"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

export function DeepPlanEnsembleButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/deep-plan-ensemble`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          data?.error ||
          "مشکلی در ساخت برنامه عمیق پیش آمد. لطفاً چند لحظه بعد دوباره تلاش کن.";
        setError(message);
      } else {
        // On success, refresh the page to show updated deepPlan
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("ارتباط با سرور برقرار نشد. لطفاً اینترنت و وضعیت سرور را بررسی کن.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[11px] md:text-[12px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            در حال تحلیل و ساخت (سه مدل)...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            ساخت پیشرفته (Gemini + GPT + Claude)
          </>
        )}
      </button>
      
      {error && (
        <p className="text-[11px] text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
          {error}
        </p>
      )}
      
      {!error && !isLoading && (
        <p className="text-[10px] text-slate-500 max-w-xs leading-5">
           تحلیل همزمان با ۳ مدل هوش مصنوعی برای دقت و عمق بیشتر.
        </p>
      )}
    </div>
  );
}
