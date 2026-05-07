import sys
from pathlib import Path

import streamlit as st

sys.path.append(str(Path(__file__).resolve().parents[1]))

from llm import DEFAULT_MODEL, chat_stream, make_user_message  # noqa: E402


st.set_page_config(page_title="NVIDIA Chatbot", page_icon="💬", layout="centered")
st.title("Chatbot")
st.caption("Local UI that calls NVIDIA `v1/chat/completions`.")

with st.sidebar:
    st.subheader("Settings")
    model = st.text_input("Model", value=DEFAULT_MODEL)
    uploaded = st.file_uploader(
        "Upload an image (optional)",
        type=["png", "jpg", "jpeg", "webp"],
        help="If you upload an image, your next message will include it.",
    )
    if st.button("Reset chat"):
        st.session_state.messages = []

if "messages" not in st.session_state:
    st.session_state.messages = []

for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m.get("content", ""))

prompt = st.chat_input("Ask something… (optionally with an uploaded image)")
if prompt:
    image_bytes = uploaded.getvalue() if uploaded is not None else None
    image_mime = uploaded.type if uploaded is not None else "image/png"

    user_msg = make_user_message(prompt, image_bytes=image_bytes, image_mime=image_mime)
    st.session_state.messages.append(user_msg)

    with st.chat_message("user"):
        st.markdown(prompt)
        if uploaded is not None:
            st.image(uploaded, caption="Uploaded image", use_container_width=True)

    with st.chat_message("assistant"):
        def token_gen():
            yield from chat_stream(st.session_state.messages, model=model)

        answer = st.write_stream(token_gen)

    st.session_state.messages.append({"role": "assistant", "content": answer})

