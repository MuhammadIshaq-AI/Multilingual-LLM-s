# Multi-langual SAAS 🚀

A professional, SaaS-ready workspace for building and experimenting with **NVIDIA NIM** models. This repository provides a high-performance Next.js application integrated with multimodal chat and image generation capabilities.

---

© 2026 AI Cortexo.

## ✨ Features

- 🤖 **Advanced Chatbot**: Support for multimodal interactions (text + vision) using NVIDIA NIM endpoints.
- 🎨 **Image Generation**: High-quality image synthesis from text prompts via Hugging Face & fal-ai.
- 🛡️ **SaaS Infrastructure**:
  - **Server-side API Protection**: Your NVIDIA and Hugging Face keys never touch the client.
  - **Smart Rate Limiting**: Per-IP rate limiting (Upstash Redis for production, in-memory for dev).
- 💎 **Premium UI**: Streamlined, glassmorphic design built with Tailwind CSS and Lucide icons.
- 🐳 **Docker Ready**: Optimized multi-stage Dockerfile for instant deployment on AWS EC2 or other cloud providers.

---

## 🛠️ Project Structure

- `apps/web`: The main Next.js 15+ application (Chat & Image Studios).
- `scripts`: Utility scripts for model experimentation.
- `notebooks`: Jupyter notebooks for advanced LLM fine-tuning and testing.

---

## 🚀 Quickstart

### 1. Environment Configuration

Create a file at `apps/web/.env.local` and add your keys:

```env
NVAPI_KEY=your_nvidia_api_key
HF_TOKEN=your_huggingface_token

# Optional Configurations
NVIDIA_TEXT_MODEL=google/gemma-3n-e4b-it
HF_IMAGE_MODEL=Qwen/Qwen-Image

# Production Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 2. Local Development

```bash
cd apps/web
npm install
npm run dev
```

Visit:
- `http://localhost:3005` (Landing Page)
- `/app/chat` (Chat Studio)
- `/app/images` (Image Generation)

---

## 🚢 Deployment

### Using Docker (Recommended for AWS EC2)

The repository includes an optimized `Dockerfile` at the root.

**1. Build the Image**
```bash
docker build -t nvidia-llm-studio .
```

**2. Run the Container**
```bash
docker run -d -p 80:3000 \
  -e NVAPI_KEY=your_key_here \
  -e HF_TOKEN=your_token_here \
  --name studio nvidia-llm-studio
```

---

## 🛡️ Security & Performance

- **Rate Limiting**: 
  - Chat: 20 requests / minute / IP.
  - Images: 5 requests / minute / IP.
- **Standalone Build**: The Docker build uses Next.js `standalone` mode, significantly reducing image size and improving startup time.
- **API Security**: All AI processing is handled via Next.js Route Handlers (Server-side) to ensure API keys are never exposed in the browser.

---

