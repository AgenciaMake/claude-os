const screens = {
  code: document.getElementById('screen-code'),
  chat: document.getElementById('screen-chat'),
  done: document.getElementById('screen-done'),
};

const state = {
  code: null,
  client: null,
  messages: [],
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function addMessage(role, content) {
  const messagesEl = document.getElementById('messages');
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = content;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  const messagesEl = document.getElementById('messages');
  const typing = document.createElement('div');
  typing.className = 'message assistant typing';
  typing.id = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// Code validation
document.getElementById('code-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('code-input');
  const btn = document.getElementById('code-submit');
  const errorEl = document.getElementById('code-error');
  const code = input.value.trim().toUpperCase();

  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Validando...';

  try {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok || !data.valid) {
      errorEl.textContent = data.error || 'Código inválido ou já utilizado.';
      btn.disabled = false;
      btn.textContent = 'Começar';
      return;
    }

    state.code = code;
    state.client = data.client;
    showScreen('chat');
    await startConversation();
  } catch (err) {
    errorEl.textContent = 'Erro ao validar. Tente novamente.';
    btn.disabled = false;
    btn.textContent = 'Começar';
  }
});

async function startConversation() {
  showTyping();
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.code,
        messages: [],
      }),
    });
    const data = await res.json();
    hideTyping();
    if (data.message) {
      addMessage('assistant', data.message);
      state.messages.push({ role: 'assistant', content: data.message });
    }
  } catch (err) {
    hideTyping();
    addMessage('assistant', 'Ocorreu um erro. Por favor, recarregue a página.');
  }
}

// Chat
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-submit');
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  state.messages.push({ role: 'user', content: text });
  input.value = '';
  btn.disabled = true;
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.code,
        messages: state.messages,
      }),
    });
    const data = await res.json();
    hideTyping();

    if (data.done) {
      addMessage('assistant', data.message || 'Briefing concluído. Obrigado!');
      setTimeout(() => {
        showScreen('done');
      }, 2500);
      return;
    }

    if (data.message) {
      addMessage('assistant', data.message);
      state.messages.push({ role: 'assistant', content: data.message });
    }
  } catch (err) {
    hideTyping();
    addMessage('assistant', 'Erro de conexão. Tente reenviar.');
  } finally {
    btn.disabled = false;
    input.focus();
  }
});

// Enter to submit (Shift+Enter = newline)
document.getElementById('chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('chat-form').requestSubmit();
  }
});
