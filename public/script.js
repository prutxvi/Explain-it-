// ── SCRIPT.JS — App Page: AI Explain + Local Auth + Local History ──────────────

// Replace this with your actual Groq API Key
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';

let currentUser = null;

// ── INIT ─────────────────────────────────────────────────────────────────────
(async function init() {
  try {
    // Read user from localStorage instead of API
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }

    // 🔐 Auth guard — kick unauthenticated users to login
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    // Show user chip + logout button, hide login link
    const chip = document.getElementById('userChip');
    const logoutB = document.getElementById('logoutBtn');
    const loginLk = document.getElementById('loginLink');

    chip.textContent = `👋 ${currentUser.name.split(' ')[0]}`;
    chip.style.display = 'inline-block';
    logoutB.style.display = 'inline-block';
    if (loginLk) loginLk.style.display = 'none';

    loadHistory();

  } catch (e) {
    console.error('Init failed', e);
    window.location.href = 'login.html';
  }
})();

// ── LOGOUT ────────────────────────────────────────────────────────────────────
async function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// ── LOAD HISTORY ──────────────────────────────────────────────────────────────
function getLocalHistory() {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
}

async function loadHistory() {
  const history = getLocalHistory();
  renderHistory(history);
}

function saveToLocalHistory(item) {
  const history = getLocalHistory();
  const newItem = {
    id: Date.now(),
    ...item,
    searched_at: new Date().toISOString()
  };
  history.unshift(newItem);
  // Keep last 50
  localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 50)));
}

function renderHistory(items) {
  const list = document.getElementById('historyList');
  const histSub = document.getElementById('histSub');

  if (!list) return;

  if (!items.length) {
    list.innerHTML = `
      <div class="hist-empty" style="padding:30px 20px;color:#94a3b8;text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">🔍</div>
        <p style="font-size:0.85rem">No searches yet. Try explaining a topic!</p>
      </div>`;
    histSub.textContent = '0 searches';
    return;
  }

  histSub.textContent = `${items.length} searches saved`;
  list.innerHTML = items.map(item => `
    <div class="hist-item" onclick="reuseHistory('${escapeAttr(item.topic)}')">
      <div class="hist-item-body">
        <div class="hist-topic">${escapeHtml(item.topic)}</div>
        <div class="hist-date">${formatDate(item.searched_at)}</div>
      </div>
      <button class="hist-del" title="Remove" onclick="deleteHistory(event, ${item.id})">✕</button>
    </div>
  `).join('');
}

function escapeHtml(s) {
  return s ? s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) : '';
}
function escapeAttr(s) { return s ? s.replace(/'/g, "\\'") : ''; }
function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function reuseHistory(topic) {
  document.getElementById('topicInput').value = topic;
  explainTopic();
}

async function deleteHistory(e, id) {
  e.stopPropagation();
  let history = getLocalHistory();
  history = history.filter(item => item.id !== id);
  localStorage.setItem('searchHistory', JSON.stringify(history));
  loadHistory();
}

// ── TYPEWRITER ────────────────────────────────────────────────────────────────
function typeWriter(text, element, speed = 16) {
  return new Promise(resolve => {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i++);
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

// ── DISPLAY RESULT ────────────────────────────────────────────────────────────
async function displayResult({ summary, explanation, example }) {
  const card = document.getElementById('resultCard');
  card.classList.add('active');
  card.innerHTML = `
    <div class="section">
      <span class="tag">💡 Summary</span>
      <p id="sec-summary"></p>
    </div>
    <div class="section">
      <span class="tag">📖 Explanation</span>
      <p id="sec-explanation"></p>
    </div>
    <div class="section">
      <span class="tag">🌍 Real-World Example</span>
      <p id="sec-example"></p>
    </div>
  `;
  await typeWriter(summary || '', document.getElementById('sec-summary'));
  await typeWriter(explanation || '', document.getElementById('sec-explanation'));
  await typeWriter(example || '', document.getElementById('sec-example'));
}

// ── SET LOADING / ERROR ───────────────────────────────────────────────────────
function setLoading() {
  const card = document.getElementById('resultCard');
  card.classList.remove('active');
  card.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Asking Groq AI…</span>
    </div>`;
}

function setError(msg) {
  const card = document.getElementById('resultCard');
  card.classList.remove('active');
  card.innerHTML = `<div class="error-state">❌ ${escapeHtml(msg)}</div>`;
}

// ── EXPLAIN ───────────────────────────────────────────────────────────────────
async function explainTopic() {
  const input = document.getElementById('topicInput');
  const btn = document.getElementById('explainBtn');
  const topic = input.value.trim();

  if (!topic) { setError('Please enter a topic first!'); return; }

  btn.disabled = true;
  btn.innerHTML = `<div class="spinner" style="width:16px;height:16px;border-width:2px"></div> Thinking…`;
  setLoading();

  try {
    // Direct Browser Fetch to Groq (Bypassing Backend)
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a friendly teacher. When given a topic, respond ONLY in this exact JSON format:
{
  "summary": "One sentence simple definition of the topic.",
  "explanation": "2-3 sentences explaining how it works in plain language.",
  "example": "One short real-world or relatable example."
}
Only return valid JSON. No extra text outside the JSON.`
          },
          { role: 'user', content: `Explain this topic simply: ${topic}` }
        ],
        temperature: 1,
        response_format: { type: 'json_object' }
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Groq API error');

    const rawContent = data.choices[0]?.message?.content;
    const explanationData = JSON.parse(rawContent);

    await displayResult(explanationData);

    // Save to local history
    saveToLocalHistory({
      topic,
      summary: explanationData.summary,
      explanation: explanationData.explanation,
      example: explanationData.example
    });
    loadHistory();

  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
      </svg>
      Explain It`;
  }
}

// ── SUGGESTION CHIPS ──────────────────────────────────────────────────────────
function setTopic(topic) {
  document.getElementById('topicInput').value = topic;
  explainTopic();
}

// ── ENTER KEY ─────────────────────────────────────────────────────────────────
const topicInput = document.getElementById('topicInput');
if (topicInput) {
  topicInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') explainTopic();
  });
}
