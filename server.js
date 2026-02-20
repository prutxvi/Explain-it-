// Load .env only in local development (Vercel injects env vars automatically)
if (!process.env.VERCEL) {
  require('dotenv').config();
}

const express = require('express');
const path    = require('path');
const { Groq } = require('groq-sdk');

const app  = express();
const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/explain', async (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim() === '') {
    return res.status(400).json({ error: 'Topic cannot be empty.' });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
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
        {
          role: 'user',
          content: `Explain this topic simply: ${topic}`
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
      response_format: { type: 'json_object' }
    });

    const raw = chatCompletion.choices[0]?.message?.content;

    // Safe JSON parse with regex fallback
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI returned invalid format. Please try again.');
      parsed = JSON.parse(match[0]);
    }

    res.json({ explanation: parsed });
  } catch (err) {
    console.error('Groq Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server only when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ ExplainIt AI running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
