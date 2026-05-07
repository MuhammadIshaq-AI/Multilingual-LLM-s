
export async function generateImage(opts: {
  prompt: string;
  model?: string;
  steps?: number;
}): Promise<{ imageBase64: string }> {
  const apiKey = process.env.NVAPI_KEY;
  if (!apiKey) {
    throw new Error("Missing NVAPI_KEY environment variable");
  }

  // We'll use the NVIDIA Build API for image generation to avoid Hugging Face credit limits.
  // Standard models: "black-forest-labs/flux-1-dev", "stabilityai/sdxl-turbo", etc.
  const model = opts.model || "black-forest-labs/flux-1-dev";
  const baseUrl = "https://integrate.api.nvidia.com/v1";

  const res = await fetch(`${baseUrl}/genai/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: opts.prompt || "Astronaut riding a horse",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NVIDIA image generation failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // NVIDIA NIM responses typically put the base64 in images[0].b64_json
  const b64 = data.images?.[0]?.b64_json || data.artifacts?.[0]?.base64;

  if (!b64) {
    console.error("NVIDIA API Response:", data);
    throw new Error("No image data returned from NVIDIA API");
  }

  return { imageBase64: b64 };
}
