
"use client";

import { useState } from "react";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AISummaryBoxProps {
  projectId: string;
  initialSummary?: string | null;
  isAdmin: boolean;
}

export function AISummaryBox({
  projectId,
  initialSummary,
  isAdmin,
}: AISummaryBoxProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/ai-summary`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "مشکلی در ارتباط با هوش مصنوعی پیش آمد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-linear-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            خلاصه تحلیلی هوشمند (AI)
          </h3>
        </div>
        {isAdmin && summary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerate}
            disabled={loading}
            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="تولید مجدد"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>

      <div className="relative z-10 min-h-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-indigo-600 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium animate-pulse">
              در حال تحلیل ایده و نوشتن خلاصه...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              className="mr-2 text-xs h-7 border-red-200 hover:bg-red-100 text-red-600"
            >
              تلاش مجدد
            </Button>
          </div>
        ) : summary ? (
          <div className="prose prose-sm max-w-none text-slate-700 leading-8 whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
            <p className="text-slate-500 text-sm max-w-md">
              هنوز خلاصه‌ای برای این پروژه تولید نشده است. هوش مصنوعی می‌تواند با تحلیل ایده، یک گزارش مدیریتی کوتاه شامل مزایا، چالش‌ها و نکات کلیدی آماده کند.
            </p>
            {isAdmin ? (
              <Button
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
              >
                <Lightbulb className="w-4 h-4 ml-2" />
                تولید خلاصه با هوش مصنوعی
              </Button>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                در انتظار بررسی ادمین برای تولید خلاصه
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
