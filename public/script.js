const input      = document.getElementById('topicInput');
const btn        = document.getElementById('explainBtn');
const resultCard = document.getElementById('resultCard');

// Typewriter effect — returns a Promise so we can await each section
function typeWriter(text, element, speed = 18) {
  return new Promise((resolve) => {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

// Build the 3-section card skeleton first, then type into each
async function displayResult({ summary, explanation, example }) {
  resultCard.classList.add('active');
  resultCard.innerHTML = `
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

  // Chain typewriter — each waits for the previous to finish
  await typeWriter(summary,     document.getElementById('sec-summary'));
  await typeWriter(explanation, document.getElementById('sec-explanation'));
  await typeWriter(example,     document.getElementById('sec-example'));
}

function setLoading() {
  resultCard.classList.remove('active');
  resultCard.innerHTML = `<p class="loading">⏳ Asking Groq AI...</p>`;
}

function setError(msg) {
  resultCard.classList.remove('active');
  resultCard.innerHTML = `<p class="error">❌ ${msg}</p>`;
}

async function explainTopic() {
  const topic = input.value.trim();

  if (!topic) {
    setError('Please enter a topic first!');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Thinking...';
  setLoading();

  try {
    const res  = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');

    await displayResult(data.explanation);

  } catch (err) {
    setError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Explain It ✨';
  }
}

btn.addEventListener('click', explainTopic);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') explainTopic();
});
