"use client";

import { useMemo, useState } from "react";
import { Download, ImageIcon, Loader2, Sparkles, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Generated = {
  prompt: string;
  createdAt: number;
  imageBase64: string;
};

function asDataUrl(imageBase64: string): string {
  return imageBase64.startsWith("data:")
    ? imageBase64
    : `data:image/png;base64,${imageBase64}`;
}

export default function ImagesClient() {
  const [model, setModel] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Generated[]>([]);

  const promptOk = useMemo(() => Boolean(prompt.trim()), [prompt]);

  async function onGenerate() {
    const p = prompt.trim();
    if (!p) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: p,
          model: model || undefined,
          steps: 5,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      setItems((prev) => [
        { prompt: p, createdAt: Date.now(), imageBase64: data.imageBase64 },
        ...prev,
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <WandSparkles className="size-3.5" />
            Prompt to image
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Image studio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Compose prompts, generate square visuals, and build a gallery of results.
          </p>
        </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="studio-panel rounded-lg p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            Generation setup
          </div>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <div className="text-xs font-medium text-muted-foreground">Model override</div>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Qwen/Qwen-Image"
                className="border-white/10 bg-black/20"
              />
            </div>
            <div className="grid gap-1.5">
              <div className="text-xs font-medium text-muted-foreground">Prompt</div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic product photo of an AI workstation on a clean desk..."
                rows={9}
                className="border-white/10 bg-black/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="text-[0.7rem] text-muted-foreground">Size</div>
                <div className="mt-1 text-sm font-medium">Provider default</div>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="text-[0.7rem] text-muted-foreground">Provider</div>
                <div className="mt-1 text-sm font-medium">fal-ai</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={onGenerate} disabled={busy || !promptOk} className="h-10">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {busy ? "Generating..." : "Generate image"}
              </Button>
              <div className="text-xs text-muted-foreground">
                {busy ? "Your image is being rendered." : "Ready for a prompt."}
              </div>
            </div>
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>
        </aside>

        <div className="studio-panel min-h-[600px] rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Generated gallery</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {items.length ? `${items.length} image${items.length === 1 ? "" : "s"}` : "No images yet"}
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs text-muted-foreground">
              Live session
            </div>
          </div>

          {items.length === 0 ? (
            <div className="grid min-h-[510px] place-items-center rounded-md border border-dashed border-white/15 bg-black/20 px-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_36px_rgba(93,255,171,0.22)]">
                  <ImageIcon className="size-8" />
                </div>
                <div className="text-lg font-medium">Your gallery is empty</div>
                <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Write a detailed prompt and generate a first image. Results will appear here as polished gallery tiles.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((it) => (
                <article
                  key={it.createdAt}
                  className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={asDataUrl(it.imageBase64)}
                      alt={it.prompt}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="line-clamp-2 text-xs leading-5 text-white/85">{it.prompt}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="text-[0.7rem] text-muted-foreground">
                      {new Date(it.createdAt).toLocaleTimeString()}
                    </div>
                    <a
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-3 text-[0.8rem] font-medium transition-colors hover:bg-white/10"
                      href={asDataUrl(it.imageBase64)}
                      download={`generated-${it.createdAt}.png`}
                    >
                      <Download className="size-3.5" />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
