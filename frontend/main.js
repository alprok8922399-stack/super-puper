// frontend/main.js
const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");
function append(role, text){
  const d = document.createElement("div");
  d.textContent = role + ": " + text;
  messagesEl.appendChild(d);
}
send.onclick = async () => {
  const text = input.value.trim();
  if(!text) return;
  append("user", text);
  input.value = "";
  append("assistant", "…");
  try{
    const res = await fetch("https://YOUR_BACKEND.onrender.com/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({messages:[{role:"user",content:text}]})
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
    messagesEl.lastChild.textContent = "assistant: " + reply;
  }catch(e){
    messagesEl.lastChild.textContent = "assistant: (error)";
  }
}
