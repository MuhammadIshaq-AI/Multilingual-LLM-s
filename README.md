# nvidia-llm-models

This repo contains a **SaaS-ready Next.js app** that provides:

- **Chatbot** (with optional image upload for vision-capable models)
- **Image generation** from a text prompt
- **Per-IP rate limiting** on all AI endpoints

## Quickstart (web app)

1) Set env vars (recommended: `apps/web/.env.local`):

- `NVAPI_KEY=...`
- `HF_TOKEN=...`
- `NVIDIA_TEXT_BASE_URL=https://integrate.api.nvidia.com/v1` (optional)
- `NVIDIA_TEXT_MODEL=google/gemma-3n-e4b-it` (optional)
- `HF_IMAGE_MODEL=Qwen/Qwen-Image` (optional)
- (Optional prod rate limit) `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

Image generation uses Hugging Face Inference with provider `fal-ai` and model `Qwen/Qwen-Image`.

2) Run:

```bash
cd apps/web
npm i
npm run dev
```

Then open:

- `/` (landing)
- `/app/chat`
- `/app/images`

## Rate limiting

- Default limits:
  - **Chat**: 20 requests / minute / IP
  - **Images**: 5 requests / minute / IP
- If Upstash env vars are present, rate limiting is backed by Redis. Otherwise it falls back to an in-memory limiter (dev only).

## Python examples

The old CLI chat script lives in `examples/python/cli_chat.py`. It’s intended for local experimentation, while the “product” is the Next.js app under `apps/web`.
