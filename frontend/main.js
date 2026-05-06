// frontend/main.js

const chatForm = document.getElementById('chat-form');
const inputEl = document.getElementById('message-input');
const messagesEl = document.getElementById('messages');

async function sendMessage(message) {
  const response = await fetch('https://super-puper.onrender.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed: ${response.status} ${response.statusText} ${text}`);
  }

  const data = await response.json();
  return data;
}

function appendMessage(role, text) {
  const item = document.createElement('div');
  item.className = `message ${role}`;
  item.textContent = text;
  messagesEl.appendChild(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = inputEl.value.trim();
  if (!msg) return;
  appendMessage('user', msg);
  inputEl.value = '';
  try {
    const res = await sendMessage(msg);
    // предположим ответ в res.reply или res.message — выберем одно с приоритетом
    const reply = res.reply ?? res.message ?? JSON.stringify(res);
    appendMessage('bot', reply);
  } catch (err) {
    appendMessage('error', 'Ошибка: ' + err.message);
    console.error(err);
  }
});
