import Link from "next/link";
import { ImageIcon, MessageSquareText, Sparkles } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_28px_rgba(93,255,171,0.28)]">
              <Sparkles className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">NVIDIA LLM Studio</span>
              <span className="block text-[0.7rem] text-muted-foreground">Model workspace</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.055] p-1">
            <Link
              href="/app/chat"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <MessageSquareText className="size-4" />
              Chat
            </Link>
            <Link
              href="/app/images"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <ImageIcon className="size-4" />
              Images
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6">{children}</main>
    </div>
  );
}
