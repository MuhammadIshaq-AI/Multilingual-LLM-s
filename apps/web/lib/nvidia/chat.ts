export const DEFAULT_TEXT_MODEL = process.env.NVIDIA_TEXT_MODEL || "google/gemma-3n-e4b-it";

type ChatMessage = { role: "system" | "user" | "assistant"; content: unknown };

function nvidiaTextBaseUrl(): string {
  return (process.env.NVIDIA_TEXT_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/+$/, "");
}

function requireNvapiKey(): string {
  const key = process.env.NVAPI_KEY?.trim();
  if (!key) throw new Error("Missing NVAPI_KEY");
  return key;
}

export async function nvidiaChatStream(opts: {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${nvidiaTextBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireNvapiKey()}`,
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_TEXT_MODEL,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 512,
      temperature: opts.temperature ?? 0.2,
      top_p: opts.topP ?? 0.7,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`NVIDIA chat failed (${res.status}): ${text}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = res.body!.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by newline. We only care about `data: ...` lines.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice("data:".length).trim();
            if (!data) continue;
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const evt = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: unknown } }>;
              };
              const delta =
                typeof evt?.choices?.[0]?.delta?.content === "string"
                  ? (evt.choices![0]!.delta!.content as string)
                  : undefined;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore malformed chunks
            }
          }
        }

        controller.close();
      } catch (e) {
        controller.error(e);
      } finally {
        reader.releaseLock();
      }
    },
  });
}

