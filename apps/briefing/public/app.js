const screens = {
  code: document.getElementById('screen-code'),
  chat: document.getElementById('screen-chat'),
  done: document.getElementById('screen-done'),
};

const state = {
  code: null,
  client: null,
  messages: [],
  lastUserChecks: null,
  pendingAssistantChecks: [],
};

let audioCtx = null;
function playMessageSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const now = audioCtx.currentTime;
    const notes = [
      { freq: 660, start: 0,    dur: 0.08 },
      { freq: 880, start: 0.07, dur: 0.12 },
    ];
    notes.forEach(n => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = n.freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(0.08, now + n.start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  } catch {}
}

function markAssistantChecksRead() {
  while (state.pendingAssistantChecks.length > 0) {
    const checks = state.pendingAssistantChecks.shift();
    checks.classList.remove('sent', 'delivered');
    checks.classList.add('read');
    checks.innerHTML = CHECK_DOUBLE;
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    markAssistantChecksRead();
  }
});
window.addEventListener('focus', markAssistantChecksRead);

const CHECK_SINGLE = '<svg viewBox="0 0 16 16" width="14" height="14" class="check-icon"><path d="M2.5 8 L6 11.5 L13.5 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK_DOUBLE = '<svg viewBox="0 0 20 16" width="18" height="14" class="check-icon"><path d="M1 8 L4.5 11.5 L12 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 8 L10 11.5 L17.5 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function formatTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function stripMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')        // **negrito**
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1') // *italico*
    .replace(/__(.+?)__/g, '$1')            // __negrito__
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '$1')       // _italico_
    .replace(/`([^`]+)`/g, '$1')            // `code`
    .replace(/^#{1,6}\s+/gm, '')            // # titulos
    .replace(/^[-*+]\s+/gm, '')             // - bullets
    .replace(/—/g, ',');                     // travessao proibido
}

const STORAGE_PREFIX = 'makelemonad_briefing_';

function storageKey(code) {
  return STORAGE_PREFIX + code;
}

function saveSession() {
  if (!state.code) return;
  localStorage.setItem(storageKey(state.code), JSON.stringify({
    code: state.code,
    client: state.client,
    messages: state.messages,
    updatedAt: Date.now(),
  }));
}

function loadSession(code) {
  try {
    const raw = localStorage.getItem(storageKey(code));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession(code) {
  localStorage.removeItem(storageKey(code));
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function addMessage(role, content) {
  const messagesEl = document.getElementById('messages');
  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  if (role === 'assistant') {
    const avatar = document.createElement('img');
    avatar.src = '/alfred.png';
    avatar.alt = 'Alfred';
    avatar.className = 'avatar';
    row.appendChild(avatar);
  }

  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const textEl = document.createElement('div');
  textEl.className = 'message-text';
  textEl.textContent = role === 'assistant' ? stripMarkdown(content) : content;
  msg.appendChild(textEl);

  const meta = document.createElement('div');
  meta.className = 'message-meta';
  const timeEl = document.createElement('span');
  timeEl.className = 'message-time';
  timeEl.textContent = formatTime();
  meta.appendChild(timeEl);

  const checks = document.createElement('span');
  checks.className = 'message-checks sent';
  checks.innerHTML = CHECK_SINGLE;
  meta.appendChild(checks);

  if (role === 'user') {
    state.lastUserChecks = checks;
    setTimeout(() => {
      if (checks.classList.contains('sent')) {
        checks.classList.remove('sent');
        checks.classList.add('delivered');
        checks.innerHTML = CHECK_DOUBLE;
      }
    }, 350);
  } else {
    // assistant: delivered after 350ms; read quando a aba estiver visível
    setTimeout(() => {
      if (checks.classList.contains('sent')) {
        checks.classList.remove('sent');
        checks.classList.add('delivered');
        checks.innerHTML = CHECK_DOUBLE;
      }
    }, 350);

    state.pendingAssistantChecks.push(checks);
    if (document.visibilityState === 'visible' && document.hasFocus()) {
      setTimeout(markAssistantChecksRead, 1400);
    }
    playMessageSound();
  }

  msg.appendChild(meta);
  row.appendChild(msg);

  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function markLastUserAsRead() {
  if (!state.lastUserChecks) return;
  state.lastUserChecks.classList.remove('sent', 'delivered');
  state.lastUserChecks.classList.add('read');
  state.lastUserChecks.innerHTML = CHECK_DOUBLE;
}

function showTyping() {
  // Guarda: se já tem um "digitando" na tela, não cria outro
  if (document.querySelector('.typing-row')) return;

  const messagesEl = document.getElementById('messages');
  const row = document.createElement('div');
  row.className = 'message-row assistant typing-row';

  const avatar = document.createElement('img');
  avatar.src = '/alfred.png';
  avatar.alt = 'Alfred';
  avatar.className = 'avatar';
  row.appendChild(avatar);

  const typing = document.createElement('div');
  typing.className = 'message assistant typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  row.appendChild(typing);

  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  // Remove todos os indicadores de digitando (defensivo)
  document.querySelectorAll('.typing-row').forEach(el => el.remove());
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickWeighted(options) {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return options[options.length - 1].value;
}

function randomReadDelay() {
  // Alfred "lendo" a mensagem antes de começar a digitar
  return randBetween(1200, 3500);
}

async function humanizeReveal(messageLength) {
  // Tempo total proporcional ao tamanho + randomness
  const baseMin = Math.min(2800 + messageLength * 6, 5500);
  const baseMax = Math.min(4500 + messageLength * 10, 11000);
  const targetTotal = randBetween(baseMin, baseMax);

  // Número de "rajadas" de digitação — pesado em 2-3
  const numBursts = pickWeighted([
    { value: 1, weight: 0.15 },
    { value: 2, weight: 0.40 },
    { value: 3, weight: 0.30 },
    { value: 4, weight: 0.15 },
  ]);

  // Orçamento de pausas entre rajadas + chance de "pausa longa" (pensando)
  const basePauseBudget = (numBursts - 1) * randBetween(400, 1100);
  const longThink = Math.random() < 0.22 ? randBetween(900, 2200) : 0;
  const burstBudget = Math.max(targetTotal - basePauseBudget - longThink, 1800);

  const longThinkIndex = numBursts > 1
    ? Math.floor(Math.random() * (numBursts - 1))
    : -1;

  for (let i = 0; i < numBursts; i++) {
    showTyping();
    const burstDur = (burstBudget / numBursts) * randBetween(0.65, 1.35);
    await sleep(burstDur);
    hideTyping();

    if (i < numBursts - 1) {
      let pauseDur = randBetween(350, 900);
      if (longThink > 0 && i === longThinkIndex) {
        pauseDur = longThink;
      }
      await sleep(pauseDur);
    }
  }
}

function renderStoredMessages(messages) {
  const messagesEl = document.getElementById('messages');
  messagesEl.innerHTML = '';
  for (const m of messages) {
    addMessage(m.role, m.content);
  }
}

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

    const stored = loadSession(code);
    if (stored && stored.messages && stored.messages.length > 0) {
      state.messages = stored.messages;
      showScreen('chat');
      renderStoredMessages(state.messages);
      addMessage('assistant', '(Retomando de onde você parou. Pode continuar respondendo.)');
    } else {
      state.messages = [];
      showScreen('chat');
      await startConversation();
    }
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
    if (data.message) {
      await humanizeReveal(data.message.length);
      addMessage('assistant', data.message);
      state.messages.push({ role: 'assistant', content: data.message });
      saveSession();
    } else {
      hideTyping();
    }
  } catch (err) {
    hideTyping();
    addMessage('assistant', 'Ocorreu um erro. Por favor, recarregue a página.');
  }
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-submit');
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  state.messages.push({ role: 'user', content: text });
  saveSession();
  input.value = '';
  input.style.height = 'auto';
  btn.disabled = true;
  setTimeout(() => markLastUserAsRead(), 900);

  try {
    const apiPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.code,
        messages: state.messages,
      }),
    }).then(r => r.json());

    await sleep(randomReadDelay());
    showTyping();

    const data = await apiPromise;

    if (data.done) {
      const finalMsg = data.message || 'Briefing concluído. Obrigado!';
      await humanizeReveal(finalMsg.length);
      addMessage('assistant', finalMsg);
      clearSession(state.code);
      setTimeout(() => {
        showScreen('done');
      }, 2500);
      return;
    }

    if (data.message) {
      await humanizeReveal(data.message.length);
      addMessage('assistant', data.message);
      state.messages.push({ role: 'assistant', content: data.message });
      saveSession();
    }
  } catch (err) {
    hideTyping();
    addMessage('assistant', 'Erro de conexão. Tente reenviar.');
  } finally {
    btn.disabled = false;
    input.focus();
  }
});

const chatInput = document.getElementById('chat-input');

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('chat-form').requestSubmit();
  }
});

function autoResizeInput() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
}

chatInput.addEventListener('input', autoResizeInput);
