# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up API Key

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

Get an API key at: https://console.anthropic.com/

## 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 4. Try It Out

Ask one of these questions:

- "What are the best practices for hiring?"
- "How should we address poverty?"
- "What makes a good leader?"
- "What is professional attire?"

You'll see:
- Left side: Standard AI response
- Right side: Critical analysis of biases and missing perspectives

## Troubleshooting

**Can't see the app?**
- Make sure you're on http://localhost:5173
- Check the terminal for any error messages

**API Key Error?**
- Verify your `.env` file exists in the project root
- Check that the key starts with `sk-ant-`
- Make sure there are no extra spaces

**Build Fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## For Classroom Demos

1. Instructor sets up `.env` with their API key
2. Run `npm run dev`
3. Project to class screen
4. Students suggest questions to explore
5. Use critiques to spark discussion

The app works entirely in the browser - no backend needed!
