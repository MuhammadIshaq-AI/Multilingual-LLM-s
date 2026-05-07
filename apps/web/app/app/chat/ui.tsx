"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bot,
  ImagePlus,
  Loader2,
  MessageSquareText,
  Paperclip,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Role = "user" | "assistant" | "system";
type Msg = { role: Role; content: string };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function ChatClient() {
  const [model, setModel] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  async function onSend() {
    const text = prompt.trim();
    if (!text && !imageFile) return;

    setError(null);
    setBusy(true);

    const userText = text || "Describe the image.";
    const nextMessages: Msg[] = [...messages, { role: "user", content: userText }];
    setMessages(nextMessages);
    setPrompt("");

    let imageDataUrl: string | undefined = undefined;
    if (imageFile) {
      imageDataUrl = await fileToDataUrl(imageFile);
      setImageFile(null);
    }

    const assistantIndex = nextMessages.length;
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const ac = new AbortController();
    controllerRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          model: model || undefined,
          messages: nextMessages,
          imageDataUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Missing response body");

      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          const cur = copy[assistantIndex];
          if (cur?.role === "assistant") copy[assistantIndex] = { ...cur, content: full };
          return copy;
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((prev) => prev.filter((_, idx) => idx !== assistantIndex));
    } finally {
      setBusy(false);
      controllerRef.current = null;
    }
  }

  function onReset() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setMessages([]);
    setPrompt("");
    setImageFile(null);
    setError(null);
    setBusy(false);
  }

  const examples = [
    "Summarize the NVIDIA API setup in this project.",
    "Write a product launch email for this AI tool.",
    "Explain how image upload is passed to the API.",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <MessageSquareText className="size-3.5" />
            Multimodal chat
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Chat studio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A focused workspace for prompts, images, and streamed model responses.
          </p>
        </div>
        <Button variant="outline" onClick={onReset} disabled={busy && messages.length === 0}>
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="studio-panel rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="size-4 text-primary" />
              Session controls
            </div>
            <div className="space-y-4">
              <div className="grid gap-1.5">
                <div className="text-xs font-medium text-muted-foreground">Model override</div>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="google/gemma-3n-e4b-it"
                  className="border-white/10 bg-black/20"
                />
              </div>
              <div className="grid gap-1.5">
                <div className="text-xs font-medium text-muted-foreground">Image upload</div>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="border-white/10 bg-black/20"
                />
              </div>

              {imagePreviewUrl ? (
                <div className="overflow-hidden rounded-md border border-white/10 bg-black/20">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <ImagePlus className="size-3.5 text-primary" />
                      Attached image
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setImageFile(null)}
                      aria-label="Remove image"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded preview"
                    className="max-h-60 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-white/15 bg-black/20 p-4 text-sm leading-6 text-muted-foreground">
                  <Paperclip className="mb-3 size-5 text-primary" />
                  Attach an image to make the next message multimodal.
                </div>
              )}
            </div>
          </div>

          <div className="studio-panel rounded-lg p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Try a prompt
            </div>
            <div className="space-y-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs leading-5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="studio-panel overflow-hidden rounded-lg">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_rgba(93,255,171,0.75)]" />
              <span className="text-sm font-medium">Conversation</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {messages.length} messages
            </div>
          </div>

          <div className="min-h-[430px] p-4 sm:p-5">
            {messages.length === 0 ? (
              <div className="flex min-h-[410px] flex-col items-center justify-center rounded-md border border-dashed border-white/15 bg-black/20 px-6 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_36px_rgba(93,255,171,0.22)]">
                  <Bot className="size-7" />
                </div>
                <div className="text-lg font-medium">Ready for your first prompt</div>
                <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Ask a question, draft content, inspect an uploaded image, or test a model override.
                </div>
              </div>
            ) : (
              <div className="max-h-[560px] space-y-5 overflow-y-auto pr-1">
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <div key={idx} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser ? (
                        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <Bot className="size-5" />
                        </div>
                      ) : null}
                      <div
                        className={`max-w-[88%] rounded-md px-4 py-3 text-sm leading-6 shadow-lg ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "border border-white/10 bg-white/[0.06]"
                        }`}
                      >
                        <div className="mb-1 text-[0.68rem] font-semibold uppercase tracking-wide opacity-70">
                          {isUser ? "You" : "Assistant"}
                        </div>
                        <div className="whitespace-pre-wrap">{m.content || "Thinking..."}</div>
                      </div>
                      {isUser ? (
                        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07]">
                          <User className="size-5" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-black/20 p-4">
            <div className="rounded-md border border-white/10 bg-background/50 p-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything..."
                rows={4}
                className="min-h-24 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
              />
              <div className="flex flex-col gap-3 px-2 pb-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  {busy ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-3.5 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    "Ready"
                  )}
                </div>
                <Button onClick={onSend} disabled={busy}>
                  <Send className="size-4" />
                  Send prompt
                </Button>
              </div>
            </div>

            {error ? (
              <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
