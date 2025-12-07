import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            پلن‌های استفاده از پلتفرم
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-8">
            از یک پلن رایگان برای تست شروع کن و هر زمان آماده بودی، به پلن حرفه‌ای‌تر ارتقا بده تا به همه‌ی قابلیت‌ها دسترسی داشته باشی.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* FREE PLAN */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">پلن رایگان</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">رایگان</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "۱ پروژه فعال",
                  "خلاصه یک‌صفحه‌ای ایده",
                  "مشاهده‌ی محدود برخی بخش‌های تحلیل",
                  "مناسب برای تست اولیه ایده"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button disabled className="w-full rounded-xl border border-slate-300 bg-slate-50 text-slate-500 py-3 text-sm font-semibold cursor-default">
              در حال استفاده
            </button>
          </div>

          {/* STARTER PLAN */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 shadow-xl p-8 flex flex-col justify-between transform md:-translate-y-4 relative">
             <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                پیشنهاد ویژه
             </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">پلن استارتر</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">۹۹,۰۰۰</span>
                <span className="text-slate-500 mr-2 text-sm">تومان / ماه</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "تا ۵ پروژه فعال",
                  "دسترسی به برنامه عمیق (Deep Plan)",
                  "پیشنهادهای اولیه برای لندینگ پیج",
                  "پشتیبانی ایمیلی پایه"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="w-full rounded-xl bg-indigo-600 text-white py-3 text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              فعلاً فقط دکمه نمایشی (پرداخت بعداً)
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">پلن حرفه‌ای</h3>
              <div className="mb-6 flex items-baseline">
                 <span className="text-2xl font-bold text-slate-900">قیمت توافقی</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "پروژه‌های نامحدود",
                  "دسترسی کامل به همه‌ی ماژول‌ها",
                  "کوچ اجرا و تسک‌های هوشمند",
                  "پشتیبانی اختصاصی و منتورینگ"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button disabled className="w-full rounded-xl bg-slate-100 text-slate-400 py-3 text-sm font-semibold cursor-not-allowed">
              به زودی
            </button>
          </div>

        </div>

        <div className="text-center pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
            پرداخت و فعال‌سازی پلن‌ها در نسخه‌های بعدی فعال می‌شود. فعلاً می‌توانید پلن رایگان را تست کنید.
            </p>
        </div>

      </div>
    </div>
  );
}
