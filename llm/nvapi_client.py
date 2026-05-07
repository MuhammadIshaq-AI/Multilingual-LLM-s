import base64
import json
import os
from pathlib import Path
from typing import Iterable, Optional

import requests
from dotenv import load_dotenv

INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
DEFAULT_MODEL = "google/gemma-3n-e4b-it"

# We keep reading secrets from scripts/.env to avoid moving user secrets around.
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / "scripts" / ".env")


def get_api_key() -> str:
    key = os.getenv("NVAPI_KEY", "").strip().strip('"').strip("'")
    if not key:
        raise RuntimeError(
            "Missing NVAPI_KEY. Put it in scripts/.env (NVAPI_KEY=...) or set it as an environment variable."
        )
    return key


def make_user_message(text: str, image_bytes: Optional[bytes] = None, image_mime: str = "image/png") -> dict:
    """
    Builds a user message compatible with common multimodal chat schemas:
    content can be a string (text-only) or a list of content parts (text + image_url).
    """
    text = (text or "").strip()
    if not image_bytes:
        return {"role": "user", "content": text}

    b64 = base64.b64encode(image_bytes).decode("ascii")
    data_url = f"data:{image_mime};base64,{b64}"
    return {
        "role": "user",
        "content": [
            {"type": "text", "text": text or "Describe this image."},
            {"type": "image_url", "image_url": {"url": data_url}},
        ],
    }


def chat_stream(
    messages: list[dict],
    *,
    model: str = DEFAULT_MODEL,
    max_tokens: int = 512,
    temperature: float = 0.2,
    top_p: float = 0.7,
    timeout_s: int = 120,
) -> Iterable[str]:
    headers = {
        "Authorization": f"Bearer {get_api_key()}",
        "Accept": "text/event-stream",
    }

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
        "stream": True,
    }

    resp = requests.post(INVOKE_URL, headers=headers, json=payload, timeout=timeout_s)
    resp.raise_for_status()

    for raw in resp.iter_lines(decode_unicode=True):
        if not raw:
            continue
        line = raw.strip()
        if not line.startswith("data:"):
            continue

        data = line[len("data:") :].strip()
        if data == "[DONE]":
            break

        try:
            event = json.loads(data)
        except json.JSONDecodeError:
            continue

        delta = event.get("choices", [{}])[0].get("delta", {}).get("content")
        if delta:
            yield delta


def chat(
    messages: list[dict],
    *,
    model: str = DEFAULT_MODEL,
    max_tokens: int = 512,
    temperature: float = 0.2,
    top_p: float = 0.7,
    timeout_s: int = 120,
) -> str:
    headers = {
        "Authorization": f"Bearer {get_api_key()}",
        "Accept": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
        "stream": False,
    }

    resp = requests.post(INVOKE_URL, headers=headers, json=payload, timeout=timeout_s)
    resp.raise_for_status()
    data = resp.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "")

