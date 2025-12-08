import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDashed } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  hasData: boolean;
}

export function ToolCard({
  title,
  description,
  href,
  hasData,
}: ToolCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm md:text-[15px] font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
          {title}
        </h3>
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] md:text-[11px] font-medium border " +
            (hasData
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-200")
          }
        >
          {hasData ? (
             <>
                <CheckCircle2 className="w-3 h-3" />
                آماده
             </>
          ) : (
             <>
                <CircleDashed className="w-3 h-3" />
                هنوز ساخته نشده
             </>
          )}
        </span>
      </div>

      <p className="text-[11px] md:text-[12px] text-slate-600 leading-5 min-h-[40px]">
        {description}
      </p>

      <div className="mt-auto pt-2 flex justify-end">
        <Link
          href={href}
          className={
            "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] md:text-[12px] font-semibold transition-all " +
            (hasData 
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" 
                : "bg-slate-900 text-white hover:bg-slate-800")
          }
        >
          {hasData ? "مشاهده و ویرایش" : "ورود به ابزار و ساخت"}
          <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
