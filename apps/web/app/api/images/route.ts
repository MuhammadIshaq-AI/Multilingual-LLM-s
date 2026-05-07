import { NextResponse } from "next/server";

import { generateImage } from "@/lib/nvidia/image";
import { enforceRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    await enforceRateLimit({ req, scope: "images", limit: 5, windowSeconds: 60 });

    const body = (await req.json()) as {
      prompt: string;
      model?: string;
      steps?: number;
    };

    if (!body?.prompt?.trim()) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const { imageBase64 } = await generateImage({
      prompt: body.prompt,
      model: body.model,
      steps: body.steps,
    });

    return NextResponse.json({ imageBase64 }, { status: 200 });
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
