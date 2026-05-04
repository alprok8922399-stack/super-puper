from fastapi import FastAPI, HTTPException from pydantic import BaseModel import os, httpx from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
raise RuntimeError("OPENAI_API_KEY not set")

app = FastAPI()

class Message(BaseModel):
role: str
content: str

class ChatRequest(BaseModel):
messages: list[Message]

@app.post("/api/chat")
async def chat(req: ChatRequest):
system = {"role": "system", "content": "You are a helpful assistant."}
payload = {
"model": "gpt-4o-mini",
"messages": [system] + [m.dict() for m in req.messages]
}
headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
async with httpx.AsyncClient(timeout=30.0) as client:
try:
r = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
r.raise_for_status()
except httpx.HTTPError as e:
raise HTTPException(status_code=500, detail=str(e))
return r.json()
