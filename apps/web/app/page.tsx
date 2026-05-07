import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ImageIcon,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
  LayoutDashboard,
  Cpu,
  Globe,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden selection:bg-primary/30">
      {/* Background Decor */}
      <div className="studio-grid pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-primary/5 blur-[100px]" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Sparkles className="size-5" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">AI Cortexo</span>
            </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {["Models", "API", "Docs"].map((item) => (
              <Link key={item} href="#" className="text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-white">
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/app/chat" className="text-[0.8rem] font-medium text-muted-foreground hover:text-white transition-colors px-3">
              Sign In
            </Link>
            <Link
              href="/app/images"
              className="inline-flex h-8 items-center justify-center rounded-full bg-white px-4 text-[0.8rem] font-bold text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero & Product Section */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-24">
          <div className="flex flex-col items-center text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[0.7rem] font-bold text-primary backdrop-blur-sm">
              <Zap className="size-3 fill-current" />
              v1.0 is now live
            </div>
            <h1 className="text-gradient text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
              Build AI apps at the speed of thought.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              A high-performance workspace for NVIDIA NIM. 
              Secure, lightning-fast, and developer-first.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/app/chat"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_rgba(93,255,171,0.2)] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Launch Studio
              </Link>
              <Link
                href="/app/images"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
              >
                Documentation
              </Link>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-b from-primary/20 to-transparent blur-xl opacity-50" />
            <div className="studio-panel relative overflow-hidden rounded-xl border border-white/10 bg-[#071117]/90 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-white/10" />
                  <div className="size-2 rounded-full bg-white/10" />
                  <div className="size-2 rounded-full bg-white/10" />
                </div>
                <div className="text-[0.6rem] font-medium text-white/30 uppercase tracking-widest">
                  Live Preview
                </div>
                <div className="size-2" />
              </div>
              
              <div className="grid lg:grid-cols-[1fr_240px] divide-x divide-white/5">
                <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="size-8 shrink-0 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <BrainCircuit className="size-4 text-zinc-400" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[0.65rem] font-bold text-zinc-500 uppercase tracking-wider">Prompt</div>
                      <div className="text-sm text-zinc-300">Refactor this React component for performance.</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                      <Sparkles className="size-4 text-primary-foreground" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[0.65rem] font-bold text-primary uppercase tracking-wider">Assistant</div>
                      <div className="text-sm text-zinc-300 leading-relaxed">
                        I've analyzed your component. Implementing <code className="text-primary">useMemo</code> and <code className="text-primary">useCallback</code> will reduce unnecessary re-renders by 40%...
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block p-6 bg-white/[0.01]">
                  <div className="space-y-6">
                    <div>
                      <div className="text-[0.6rem] font-bold text-zinc-500 uppercase tracking-widest mb-3">Model Stats</div>
                      <div className="space-y-3">
                        {[
                          ["Latency", "42ms", "w-[85%]"],
                          ["Throughput", "120 t/s", "w-[60%]"],
                        ].map(([k, v, w]) => (
                          <div key={k}>
                            <div className="flex justify-between text-[0.65rem] mb-1.5">
                              <span className="text-zinc-500">{k}</span>
                              <span className="text-zinc-300 font-medium">{v}</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={`${w} h-full bg-primary rounded-full`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold text-zinc-500 uppercase tracking-widest mb-3">Deployment</div>
                      <div className="rounded-md border border-white/5 bg-white/5 p-2.5 space-y-2">
                        <div className="flex justify-between text-[0.65rem]">
                          <span className="text-zinc-500">Region</span>
                          <span className="text-zinc-300">Global-Edge</span>
                        </div>
                        <div className="flex justify-between text-[0.65rem]">
                          <span className="text-zinc-500">Status</span>
                          <span className="text-green-400 font-bold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Compact */}
        <section className="border-t border-white/5 bg-white/[0.01] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Security-First",
                  desc: "API keys stay on the server. Zero client-side leakage.",
                  icon: ShieldCheck,
                },
                {
                  title: "Edge Delivery",
                  desc: "Streaming responses from the closest NVIDIA region.",
                  icon: Zap,
                },
                {
                  title: "Universal API",
                  desc: "One interface for chat, vision, and image models.",
                  icon: LayoutDashboard,
                },
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <f.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Compact */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-emerald-400 p-12 text-center shadow-xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-black mb-4">Start building today.</h2>
              <p className="text-black/70 font-medium mb-8 max-w-lg mx-auto">
                Join thousands of developers building the next generation of AI applications.
              </p>
              <Link
                href="/app/chat"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-black px-8 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-background/50 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-[0.6rem] font-bold">AC</div>
            <span className="text-xs font-bold text-white">AI Cortexo</span>
          </div>
          <div className="flex gap-8 text-[0.7rem] font-medium text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Github</Link>
            <Link href="#" className="hover:text-white transition-colors">Status</Link>
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            © 2026 NVIDIA Studio.
          </p>
        </div>
      </footer>
    </div>
  );
}
