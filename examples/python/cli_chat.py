
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from llm import DEFAULT_MODEL, chat_stream  # noqa: E402


def main() -> None:
    model = DEFAULT_MODEL
    messages: list[dict] = []

    print("Interactive Q&A. Type your question and press Enter.")
    print("Commands: exit | quit | /reset")
    print(f"Model: {model}")

    while True:
        q = input("\nYou: ").strip()
        if not q:
            continue
        if q.lower() in {"exit", "quit"}:
            break
        if q.lower() == "/reset":
            messages = []
            print("Conversation reset.")
            continue

        messages.append({"role": "user", "content": q})
        print("Assistant: ", end="", flush=True)
        full = []
        for tok in chat_stream(messages=messages, model=model):
            print(tok, end="", flush=True)
            full.append(tok)
        print()
        messages.append({"role": "assistant", "content": "".join(full)})


if __name__ == "__main__":
    main()
