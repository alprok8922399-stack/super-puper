document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message");
  const messages = document.getElementById("messages");
  const backendUrl = "https://super-puper.onrender.com/api/chat"; // <- замените, если нужно

  function appendMessage(author, text) {
    const el = document.createElement("div");
    el.className = author === "user" ? "msg user" : "msg bot";
    el.textContent = (author === "user" ? "Вы: " : "Бот: ") + text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(text) {
    appendMessage("user", text);
    appendMessage("bot", "…пишет");
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const last = messages.querySelector(".msg.bot:last-child");
      if (last && last.textContent.includes("…пишет")) last.remove();

      if (!res.ok) {
        const bodyText = await res.text();
        appendMessage("bot", `Ошибка: ${res.status} ${bodyText}`);
        return;
      }
      const data = await res.json();
      const reply = data.reply ?? JSON.stringify(data);
      appendMessage("bot", reply);
    } catch (err) {
      const last = messages.querySelector(".msg.bot:last-child");
      if (last && last.textContent.includes("…пишет")) last.remove();
      appendMessage("bot", `Ошибка сети: ${err.message}`);
    }
  }

  if (!form || !input || !messages) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });
});
