from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="chat-ai-backend")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"status":"ok"}

@app.get("/api/chat/test")
async def chat_test():
  return {"reply":"test ok"}

# keep /api/chat (POST) if you have OpenAI key configured
from pydantic import BaseModel
from fastapi import HTTPException
try:
  import openai
except Exception:
  openai = None

class Msg(BaseModel):
  message: str

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_KEY and openai:
  openai.api_key = OPENAI_KEY

@app.post("/api/chat")
async def chat(msg: Msg):
  if not OPENAI_KEY:
    raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
  try:
    resp = openai.ChatCompletion.create(
      model="gpt-4o-mini",
      messages=[{"role":"user","content": msg.message}],
      max_tokens=150
    )
    text = resp.choices[0].message["content"]
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  return {"reply": text}
