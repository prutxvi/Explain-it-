# ExplainIt AI (Frontend Only)

An AI-powered topic explainer that breaks down any complex topic into a simple summary, explanation, and real-world example — powered by Groq's Llama 3.3 70B model.

This version is a **pure frontend application**. It has no backend or database. All data (user sessions and search history) is stored locally in your browser using `localStorage`.

## Features

- **Instant Auth**: Any email/password will grant access to the dashboard.
- **Local History**: Your search history is saved locally on your device.
- **Direct AI Integration**: Calls the Groq API directly from the browser.
- **3D Landing Page**: Stunning visual experience with Three.js.

## Tech Stack

- **Frontend**: Vanilla HTML / CSS / JavaScript
- **3D Graphics**: Three.js
- **AI**: Groq API (Llama 3.3 70B)
- **Persistence**: Browser `localStorage`

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/prutxvi/Explain-it-.git
   ```

2. Open `public/script.js` and replace `YOUR_GROQ_API_KEY_HERE` with your actual Groq API key.

3. Serve the `public` folder using any static server:
   ```bash
   npx serve public
   ```
   Or simply open `index.html` in your browser (Note: some features like `fetch` might require a local server).

## Project Structure

```
Explain-it-/
├── public/                 # All frontend files
│   ├── index.html          # Landing page
│   ├── app.html            # Dashboard
│   ├── script.js           # Core logic (AI + LocalStorage)
│   ├── auth.js             # Mock authentication
│   └── ...
├── package.json            # Simple config for static serving
└── README.md
```
