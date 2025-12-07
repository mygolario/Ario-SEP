import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutTemplate, Layers, Palette, Layout, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import IdeaIntakeForm from '@/components/IdeaIntakeForm';

export default async function LandingPage() {
  const session = await auth();
  const isSignedIn = !!session?.user;

  return (
    // Main layout wrapper
    <div key="landing-root" className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2">
             <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
             <span>StartupExec</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
                <AuthButton />
            ) : (
                <div className="flex items-center gap-4">
                     <Button asChild variant="ghost">
                        <Link href="/api/auth/signin">ورود</Link>
                     </Button>
                     <Button asChild>
                        <Link href="/builder">شروع کنید</Link>
                     </Button>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-4 text-center bg-slate-50 dark:bg-slate-950/50">
           <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300 mb-4">
                  پلتفرم اجرای استارتاپ با هوش مصنوعی
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                ایده استارتاپی‌تان را به یک <span className="text-indigo-600 dark:text-indigo-400">برنامه اجرایی واقعی</span> تبدیل کنید.
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                با کمک هوش مصنوعی، از مپ یک‌صفحه‌ای تا استراتژی عمیق، برندسازی، لندینگ پیج و قدم‌های بعدی را برای بازار ایران طراحی کنید.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                 {isSignedIn ? (
                    <>
                        <Button asChild className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors h-auto">
                            <Link href="/dashboard">
                                برو به داشبورد
                                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm md:text-base font-medium text-slate-800 hover:bg-slate-50 transition-colors h-auto">
                             <Link href="/builder">
                                شروع پروژه جدید
                             </Link>
                        </Button>
                    </>
                 ) : (
                    <>
                        <Button asChild className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors h-auto">
                             <Link href="/builder">
                                شروع اولین پلن استارتاپی
                                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                             </Link>
                        </Button>
                        <Button asChild variant="outline" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm md:text-base font-medium text-slate-800 hover:bg-slate-50 transition-colors h-auto">
                             <Link href="/api/auth/signin">
                                ورود به حساب کاربری
                             </Link>
                        </Button>
                    </>
                 )}
              </div>
              <p className="text-xs text-muted-foreground pt-4">بدون نیاز به کارت بانکی. نسخه بتای اولیه مخصوص فاوندرهای ایرانی.</p>
           </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">از ایده تا اجرا در چند دقیقه</h2>
                    <p className="text-muted-foreground">به‌جای بیش‌فکر کردن، ساختن را شروع کنید. روند کار با پلتفرم این‌طور است:</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {[
                        { step: "01", title: "توضیح ایده", desc: "ایده‌تان را خیلی ساده و خودمانی توضیح می‌دهید؛ لازم نیست اصطلاحات فنی بلد باشید." },
                        { step: "02", title: "ساخت مپ یک‌صفحه‌ای", desc: "یک مپ استراتژی یک‌صفحه‌ای دریافت می‌کنید که مدل کسب‌وکار، ارزش پیشنهادی و مسیر حرکت را نشان می‌دهد." },
                        { step: "03", title: "تحلیل عمیق", desc: "پرسونا، رقبا، استراتژی ورود به بازار و جزئیات برندینگ شما با کمک هوش مصنوعی باز می‌شود." },
                        { step: "04", title: "اجرا", desc: "با کمک تسک‌های روزانه و برنامه اجرایی، قدم‌به‌قدم به لانچ محصول‌تان نزدیک می‌شوید." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg border-4 border-background">
                                {item.step}
                            </div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                    {/* Connecting line for desktop */}
                </div>
            </div>
        </section>

        {/* Idea Intake Form Section */}
        {/* Idea Intake Form Section */}
        <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950/50" id="intake-form">
            <div className="container mx-auto max-w-2xl text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">ثبت ایده و شروع ارزیابی</h2>
                <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
                  این فرم فقط چند سؤال ساده دارد و پر کردنش حدود ۲–۳ دقیقه طول می‌کشد. لازم نیست جزئیات فنی بنویسید؛ فقط واضح بگویید چه می‌خواهید بسازید، ما کمک می‌کنیم آن را به پلن اجرایی تبدیل کنید.
                </p>
            </div>
            <IdeaIntakeForm />
        </section>


        {/* Core Features */}
        <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950/50">
             <div className="container mx-auto max-w-5xl px-4 md:px-6">
                 <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">همه‌چیز برای لانچ محصول در یک‌جا</h2>
                    <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">ابزارهای کامل برای فاوندرهایی که می‌خواهند در بازار ایران جدی بسازند، نه فقط ایده‌پردازی کنند.</p>
                </div>

                <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard 
                        icon={<LayoutTemplate className="h-5 w-5" />}
                        title="استراتژی یک‌صفحه‌ای"
                        desc="مدل کسب‌وکار، ارزش پیشنهادی و نقشه راه را روی یک صفحه واضح می‌بینید."
                    />
                    <FeatureCard 
                        icon={<Layers className="h-5 w-5" />}
                        title="حالت استراتژی عمیق"
                        desc="تحلیل جزئی مخاطب، رقبا و سناریوهای رشد، مخصوص مارکت ایران."
                    />
                    <FeatureCard 
                        icon={<Palette className="h-5 w-5" />}
                        title="بسته برندسازی"
                        desc="پالت رنگ، تایپوگرافی، لحن برند و پیشنهادهای هویتی متناسب با مخاطب فارسی‌زبان."
                    />
                    <FeatureCard 
                        icon={<Layout className="h-5 w-5" />}
                        title="برنامه لندینگ پیج"
                        desc="ساختار صفحه، سکشن‌ها و متن‌های لندینگ پیج آماده برای پیاده‌سازی."
                    />
                     <FeatureCard 
                        icon={<Zap className="h-5 w-5" />}
                        title="کوچ اجرایی"
                        desc="لیست تسک‌های روزانه و هفتگی تا کار از «در حد حرف» به «در حال اجرا» برسد."
                    />
                     <FeatureCard 
                        icon={<ArrowRight className="h-5 w-5" />}
                        title="داشبورد و خروجی PDF"
                        desc="مدیریت چند پروژه در یک داشبورد و خروجی گرفتن از پلن‌ها به صورت PDF حرفه‌ای."
                    />
                </div>
             </div>
        </section>

        {/* Who it is for */}
        <section className="py-16 md:py-20 px-4">
             <div className="container mx-auto max-w-4xl bg-slate-900 text-slate-50 rounded-3xl px-6 md:px-10 py-8 md:py-10 space-y-4">
                 <h2 className="text-xl md:text-2xl font-bold">برای کسانی که واقعا می‌سازند</h2>
                 <p className="text-sm md:text-base text-slate-300 max-w-2xl">اگر اهل اجرا هستید و نمی‌خواهید ماه‌ها فقط ایده را در ذهن‌تان بچرخانید، این پلتفرم برای شماست.</p>
                 <div className="flex flex-wrap items-center gap-3 mt-3">
                     {['فاوندرهای تنها', 'سازندگان مستقل', 'استارتاپ‌های نوپا', 'کارآفرینان اول'].map((label) => (
                         <div key={label} className="inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 text-xs md:text-sm text-slate-100 hover:border-slate-400 transition">
                             <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                             <span className="font-medium">{label}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-16 md:py-24 px-4 text-center">
             <div className="container mx-auto max-w-3xl space-y-6 px-4 md:px-6">
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-900">برای لانچ کردن ایده بعدی‌تان آماده‌اید؟</h2>
                 <p className="mt-2 text-sm md:text-base text-slate-600">به پلتفرمی بپیوندید که کمک می‌کند از ایده روی کاغذ، به یک پلن اجرایی واقعی برسید.</p>
                 <div className="mt-8 flex justify-center">
                    <Button asChild className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors h-auto">
                        <Link href="/builder">
                        همین حالا شروع کنید
                        </Link>
                    </Button>
                 </div>
             </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 mt-12 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto max-w-5xl px-4 md:px-6 py-8 text-center text-xs md:text-sm text-slate-500 space-y-3">
              <p className="mb-4 font-semibold text-slate-700">پلتفرم اجرای استارتاپ</p>
              <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-slate-500">
                  <a href="#" className="hover:text-slate-700 hover:underline">درباره</a>
                  <a href="#" className="hover:text-slate-700 hover:underline">امکانات</a>
                  <a href="#" className="hover:text-slate-700 hover:underline">گیت‌هاب</a>
              </div>
              <p>© {new Date().getFullYear()} آریو. همه حقوق محفوظ است.</p>
          </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 md:p-7 h-full flex flex-col">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                {icon}
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
    );
}
