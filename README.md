# ExplainIt AI

An AI-powered topic explainer that breaks down any complex topic into a simple summary, explanation, and real-world example — powered by Groq's Llama 3.3 70B model.

## Tech Stack

- **Backend**: Node.js + Express
- **AI**: Groq SDK (Llama 3.3 70B Versatile)
- **Frontend**: Vanilla HTML / CSS / JavaScript
- **Deployment**: Vercel (serverless)

## Project Structure

```
Explain-it-/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

## Local Development

1. Clone the repo
```bash
git clone https://github.com/prutxvi/Explain-it-.git
cd Explain-it-
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables
```bash
cp .env.example .env
# Then edit .env and add your GROQ_API_KEY
```

4. Run the dev server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deploy to Vercel

### Option 1 — Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repository (`prutxvi/Explain-it-`)
3. In **Environment Variables**, add:
   - `GROQ_API_KEY` → your Groq API key
4. Click **Deploy**

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# When prompted, add the env var:
vercel env add GROQ_API_KEY
vercel --prod
```

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your API key from [console.groq.com](https://console.groq.com) |

> **Note**: Never commit your `.env` file. It is already in `.gitignore`.

## API

### POST `/api/explain`

Request body:
```json
{ "topic": "Black Holes" }
```

Response:
```json
{
  "explanation": {
    "summary": "...",
    "explanation": "...",
    "example": "..."
  }
}
```
