from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import openai

app = FastAPI(title="chat-ai-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Msg(BaseModel):
    message: str

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_KEY:
    openai.api_key = OPENAI_KEY

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(msg: Msg):
    if not OPENAI_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": msg.message}],
            max_tokens=300
        )
        text = resp.choices[0].message["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"reply": text}
