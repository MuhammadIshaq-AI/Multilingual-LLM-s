import { NextResponse } from "next/server";

import { enforceRateLimit } from "@/lib/ratelimit";
import { nvidiaChatStream } from "@/lib/nvidia/chat";

type Role = "system" | "user" | "assistant";
type Message = { role: Role; content: unknown };

function withOptionalImage(messages: Message[], imageDataUrl?: string): Message[] {
  if (!imageDataUrl) return messages;
  if (messages.length === 0) return messages;

  const last = messages[messages.length - 1];
  if (last.role !== "user") return messages;

  const text = typeof last.content === "string" ? last.content : "";
  const nextLast: Message = {
    role: "user",
    content: [
      { type: "text", text: text || "Describe this image." },
      { type: "image_url", image_url: { url: imageDataUrl } },
    ],
  };

  return [...messages.slice(0, -1), nextLast];
}

export async function POST(req: Request) {
  try {
    await enforceRateLimit({ req, scope: "chat", limit: 20, windowSeconds: 60 });

    const body = (await req.json()) as {
      messages: Array<{ role: Role; content: unknown }>;
      model?: string;
      imageDataUrl?: string;
    };

    const messages = withOptionalImage(body.messages ?? [], body.imageDataUrl);
    const stream = await nvidiaChatStream({ messages, model: body.model });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const e = err as { status?: unknown; retryAfterSeconds?: unknown; message?: unknown };
    const status = typeof e?.status === "number" ? e.status : 500;
    const retryAfterSeconds = typeof e?.retryAfterSeconds === "number" ? e.retryAfterSeconds : undefined;
    const message =
      status === 429
        ? "Rate limit exceeded. Please wait and try again."
        : (typeof e?.message === "string" ? e.message : "Unexpected error");

    const res = NextResponse.json(
      { error: message, retryAfterSeconds },
      { status }
    );

    if (status === 429 && retryAfterSeconds) {
      res.headers.set("Retry-After", String(retryAfterSeconds));
    }
    return res;
  }
}

