import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutTemplate, Layers, Palette, Layout, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

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
                        <Link href="/api/auth/signin">Sign In</Link>
                     </Button>
                     <Button asChild>
                        <Link href="/builder">Get Started</Link>
                     </Button>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 text-center bg-slate-50 dark:bg-slate-950/50">
           <div className="container mx-auto max-w-4xl space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300 mb-4">
                  AI Startup Execution Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Turn your startup idea into an <span className="text-indigo-600 dark:text-indigo-400">execution-ready plan.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Plan, strategize, and generate assets with AI — from one-page maps to deep strategy, branding, landing pages, and next actions.
              </p>
              
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                 {isSignedIn ? (
                    <>
                        <Button asChild size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                            <Link href="/dashboard">
                                Go to Dashboard
                                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">
                             <Link href="/builder">
                                Start New Plan
                             </Link>
                        </Button>
                    </>
                 ) : (
                    <>
                        <Button asChild size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                             <Link href="/builder">
                                Start Your First Plan
                                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                             </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">
                             <Link href="/api/auth/signin">
                                Sign In
                             </Link>
                        </Button>
                    </>
                 )}
              </div>
              <p className="text-sm text-muted-foreground pt-4">No credit card required. Early-stage beta.</p>
           </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">From Idea to Execution in Minutes</h2>
                    <p className="text-muted-foreground">Stop overthinking and start building. Here is how it works:</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {[
                        { step: "01", title: "Describe Idea", desc: "Input your raw startup concept in simple terms." },
                        { step: "02", title: "Generate Map", desc: "Get a comprehensive one-page strategy map instantly." },
                        { step: "03", title: "Deep Dive", desc: "Unlock branding, landing page copy, and deep strategy." },
                        { step: "04", title: "Execute", desc: "Follow the AI Coach's daily tasks to launch." }
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
                    <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 z-0" />
                </div>
            </div>
        </section>

        {/* Core Features */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950/50">
             <div className="container mx-auto max-w-6xl">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Everything You Need to Launch</h2>
                    <p className="text-muted-foreground">Comprehensive tools for the solo founder.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={<LayoutTemplate className="h-6 w-6 text-blue-500" />}
                        title="One-Page Strategy"
                        desc="Visualize your entire business model, value prop, and roadmap on a single screen."
                    />
                    <FeatureCard 
                        icon={<Layers className="h-6 w-6 text-purple-500" />}
                        title="Deep Strategy Mode"
                        desc="Get detailed personas, competitor analysis, and go-to-market strategies."
                    />
                    <FeatureCard 
                        icon={<Palette className="h-6 w-6 text-pink-500" />}
                        title="Branding Kit"
                        desc="Instant visual identity: color palettes, typography, and tone of voice designed by AI."
                    />
                    <FeatureCard 
                        icon={<Layout className="h-6 w-6 text-emerald-500" />}
                        title="Landing Page Plan"
                        desc="High-conversion copy and layout structure ready for your website builder."
                    />
                     <FeatureCard 
                        icon={<Zap className="h-6 w-6 text-yellow-500" />}
                        title="Execution Coach"
                        desc="Actionable next steps and tasks to keep you moving forward every day."
                    />
                     <FeatureCard 
                        icon={<ArrowRight className="h-6 w-6 text-slate-500" />}
                        title="Dashboard & PDF"
                        desc="Manage multiple projects and export your plans to professional PDFs."
                    />
                </div>
             </div>
        </section>

        {/* Who it is for */}
        <section className="py-20 px-4">
             <div className="container mx-auto max-w-4xl text-center border rounded-2xl p-12 bg-slate-900 text-slate-50 dark:bg-slate-900/50">
                 <h2 className="text-3xl font-bold mb-8">Built for Builders</h2>
                 <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-start md:text-center">
                     {['Solo Founders', 'Indie Hackers', 'Early-stage Startups', 'First-time Entrepreneurs'].map((label) => (
                         <div key={label} className="flex items-center md:justify-center gap-2">
                             <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                             <span className="font-medium">{label}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-20 px-4 text-center">
             <div className="container mx-auto max-w-3xl space-y-8">
                 <h2 className="text-3xl md:text-5xl font-bold">Ready to launch your next big thing?</h2>
                 <p className="text-xl text-muted-foreground">Join the platform helping founders move from idea to execution.</p>
                 <Button asChild size="lg" className="text-lg h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/builder">
                        Start Building Now
                    </Link>
                 </Button>
             </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p className="mb-4 font-semibold">Startup Execution Platform</p>
              <div className="flex justify-center gap-6 mb-8">
                  <a href="#" className="hover:text-foreground">About</a>
                  <a href="#" className="hover:text-foreground">Features</a>
                  <a href="#" className="hover:text-foreground">Github</a>
              </div>
              <p>© {new Date().getFullYear()} Ario. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card>
            <CardHeader>
                <div className="mb-2 p-2 w-fit rounded-lg bg-slate-100 dark:bg-slate-800">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{desc}</p>
            </CardContent>
        </Card>
    );
}
