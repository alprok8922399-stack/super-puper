const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");

function append(role, text){
  const d = document.createElement("div");
  d.textContent = role + ": " + text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setLoading(text){
  const d = document.createElement("div");
  d.id = "loading";
  d.textContent = "assistant: " + text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function clearLoading(){
  const el = document.getElementById("loading");
  if(el) el.remove();
}

send.onclick = async () => {
  const text = input.value.trim();
  if(!text) return;
  append("user", text);
  input.value = "";
  setLoading("...");
  try{
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({messages:[{role:"user",content:text}]})
    });
    if(!res.ok){
      clearLoading();
      append("assistant", "(ошибка: " + res.status + ")");
      return;
    }
    const data = await res.json();
    clearLoading();
    const reply = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
    append("assistant", reply);
  }catch(e){
    clearLoading();
    append("assistant", "(ошибка сети)");
    console.error(e);
  }
};

document.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && document.activeElement === input) send.click();
});
