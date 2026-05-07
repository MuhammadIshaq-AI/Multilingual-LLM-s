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
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div className="studio-grid pointer-events-none absolute inset-x-0 top-0 h-[620px]" />

      <header className="relative z-10 border-b border-white/10 bg-background/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="inline-flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_32px_rgba(93,255,171,0.32)]">
              <Sparkles className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">NVIDIA LLM Studio</span>
              <span className="block text-[0.7rem] text-muted-foreground">Private model workspace</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/app/chat"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.055] px-3 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <MessageSquareText className="size-4" />
              Chat
            </Link>
            <Link
              href="/app/images"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-[0.8rem] font-semibold text-primary-foreground shadow-[0_0_28px_rgba(93,255,171,0.22)] transition-colors hover:bg-primary/90"
            >
              Launch <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-6 lg:py-12">
        <section className="grid min-h-[calc(100vh-132px)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary shadow-[0_0_30px_rgba(93,255,171,0.12)]">
              <ShieldCheck className="size-3.5" />
              Server-side NVIDIA API calls
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                A beautiful command center for AI chat and images.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Run multimodal chat, generate images, and keep your NVIDIA API key protected behind Next.js routes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app/chat"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_34px_rgba(93,255,171,0.24)] transition-colors hover:bg-primary/90"
              >
                Start chatting <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/app/images"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
              >
                <WandSparkles className="size-4 text-primary" />
                Create images
              </Link>
            </div>

            <div className="grid max-w-2xl gap-3 pt-2 sm:grid-cols-3">
              {[
                ["Private", "Server key handling", LockKeyhole],
                ["Fast", "Streaming responses", Zap],
                ["Creative", "Image generation", ImageIcon],
              ].map(([title, label, Icon]) => (
                <div key={title as string} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
                  <Icon className="mb-3 size-4 text-primary" />
                  <div className="text-sm font-medium">{title as string}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label as string}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="studio-panel rounded-lg p-3">
            <div className="overflow-hidden rounded-md border border-white/10 bg-[#071117]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_rgba(93,255,171,0.75)]" />
                  <span className="text-sm font-medium">Live model console</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.055] px-2 py-1 text-[0.7rem] text-muted-foreground">
                  qwen-image
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_230px]">
                <div className="space-y-4 p-4 sm:p-5">
                  <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <MessageSquareText className="size-4 text-primary" />
                      Conversation
                    </div>
                    <div className="space-y-3">
                      <div className="max-w-[82%] rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm leading-6 text-muted-foreground">
                        Turn this product sketch into a sharper visual concept.
                      </div>
                      <div className="ml-auto max-w-[88%] rounded-md bg-primary px-3 py-2 text-sm leading-6 text-primary-foreground">
                        I will refine the layout, lighting, materials, and composition while keeping the original concept intact.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square rounded-md border border-white/10 bg-[linear-gradient(135deg,#5DFFAB,#38BDF8_58%,#111827)] p-2">
                      <div className="h-full rounded border border-white/25 bg-black/20" />
                    </div>
                    <div className="aspect-square rounded-md border border-white/10 bg-[linear-gradient(135deg,#FACC15,#10B981_54%,#164E63)] p-2">
                      <div className="h-full rounded border border-white/25 bg-black/20" />
                    </div>
                    <div className="aspect-square rounded-md border border-white/10 bg-[linear-gradient(135deg,#A78BFA,#22C55E_58%,#020617)] p-2">
                      <div className="h-full rounded border border-white/25 bg-black/20" />
                    </div>
                  </div>

                  <div className="rounded-md border border-white/10 bg-white/[0.045] p-3">
                    <div className="mb-2 text-xs text-muted-foreground">Prompt composer</div>
                    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-muted-foreground">
                      Add cinematic lighting and clean product details...
                      <span className="ml-auto rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                        Send
                      </span>
                    </div>
                  </div>
                </div>

                <aside className="border-t border-white/10 bg-white/[0.035] p-4 lg:border-l lg:border-t-0">
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <BrainCircuit className="size-4 text-primary" />
                    Session stats
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Latency", "1.2s", "w-[72%]"],
                      ["Context", "8k", "w-[56%]"],
                      ["Creativity", "0.7", "w-[84%]"],
                    ].map(([label, value, width]) => (
                      <div key={label as string}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">{label as string}</span>
                          <span>{value as string}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10">
                          <div className={`${width as string} h-full rounded-full bg-primary`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
