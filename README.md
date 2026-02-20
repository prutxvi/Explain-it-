# ExplainIt AI 🧠

An AI-powered topic explainer that breaks down complex topics into simple, digestible explanations using the Groq API.

## Features

- 🎯 Simple and clean UI
- ⚡ Fast responses powered by Groq's Llama 3.3 70B model
- 📝 Structured explanations with summary, detailed explanation, and examples
- 🎨 Beautiful gradient interface

## Tech Stack

- **Backend**: Node.js + Express
- **AI**: Groq SDK (Llama 3.3 70B Versatile)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Vercel

## Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/prutxvi/Explain-it-.git
cd Explain-it-
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Get your Groq API key from [Groq Console](https://console.groq.com/keys)

4. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Deployment to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your GitHub repository
4. Configure environment variables:
   - Add `GROQ_API_KEY` with your Groq API key
5. Click "Deploy"

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add environment variables**
```bash
vercel env add GROQ_API_KEY
```

5. **Deploy to production**
```bash
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |
| `PORT` | Server port (default: 3000) | No |

## Project Structure

```
Explain-it-/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── script.js       # Frontend logic
├── server.js           # Express server
├── package.json        # Dependencies
├── vercel.json         # Vercel configuration
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## API Endpoint

### POST `/api/explain`

Explain a topic using AI.

**Request Body:**
```json
{
  "topic": "Quantum Computing"
}
```

**Response:**
```json
{
  "explanation": {
    "summary": "Brief definition",
    "explanation": "Detailed explanation",
    "example": "Real-world example"
  }
}
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License

## Author

Pruthvi Raj - [GitHub](https://github.com/prutxvi)

---

Made with ❤️ using Groq AI
