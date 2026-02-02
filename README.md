# AI Bias Explorer - GSBGID517

An educational web application that demonstrates AI biases, assumptions, and power dynamics through a dual-LLM system. Students ask questions via chat interface, receive an answer from one LLM, then see a critical analysis from another LLM examining biases, missing perspectives, and power dynamics.

## Features

- **Dual-LLM Architecture**: Two Claude Sonnet models work in sequence
  - **LLM #1 (Answerer)**: Provides typical AI responses
  - **LLM #2 (Critic)**: Analyzes responses for biases and missing perspectives

- **Side-by-Side Comparison**: View original answer and critical analysis simultaneously

- **Educational Focus**: Reveals implicit biases, missing perspectives, power dynamics, and information asymmetries

- **Real-Time Processing**: See responses generate in real-time with loading indicators

## Tech Stack

- **Vite** - Lightning-fast development server
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Anthropic SDK** - Claude AI integration

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com/))

## Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/katherinewang/Documents/MBA1/GSBGID517
npm install
```

### 2. Configure API Key

**Option A: Environment Variable (Recommended for classroom demos)**

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

**Option B: Runtime Input**

If no `.env` file is present, the app will prompt for the API key on startup.

### 3. Run the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## Usage

### Example Questions to Explore

These questions are designed to reveal biases and assumptions in AI responses:

1. **Hiring Practices**
   - "What are the best practices for hiring?"
   - Expected insights: "Merit" is subjective, colorblind approaches mask bias

2. **Poverty & Economics**
   - "How should we address poverty?"
   - Expected insights: Individual vs. systemic framing, missing lived experiences

3. **Leadership**
   - "What makes a good leader?"
   - Expected insights: Western, masculine assumptions about leadership

4. **Professional Norms**
   - "What is professional attire?"
   - Expected insights: Cultural and class assumptions, Eurocentric standards

5. **Education**
   - "How can we improve student performance?"
   - Expected insights: Standardized testing bias, missing perspectives on learning differences

### How It Works

1. **Ask a Question**: Type your question in the input field
2. **LLM #1 Responds**: See a typical AI assistant response (left side)
3. **LLM #2 Analyzes**: Critical analysis appears (right side) examining:
   - Assumptions & Biases
   - Missing Perspectives (race, gender, class, geography, etc.)
   - Power Dynamics
   - Information Asymmetries
   - Language & Framing choices

### Classroom Usage Tips

- **Demo Mode**: Use `.env` file with instructor's API key for seamless demos
- **Discussion Prompts**: Use the critiques to spark class discussions
- **Student Exploration**: Let students try their own questions
- **Compare Responses**: Ask similar questions in different ways to see how framing matters

## Project Structure

```
/GSBGID517
├── src/
│   ├── components/           # React UI components
│   │   ├── ChatInterface.tsx    # Main container
│   │   ├── ChatHistory.tsx      # Message list
│   │   ├── MessageBubble.tsx    # User questions
│   │   ├── MessageInput.tsx     # Input field
│   │   ├── ResponseDisplay.tsx  # Two-column layout
│   │   ├── OriginalResponse.tsx # LLM #1 answer
│   │   ├── CritiqueResponse.tsx # LLM #2 analysis
│   │   └── LoadingIndicator.tsx # Loading states
│   │
│   ├── services/             # Business logic
│   │   ├── anthropic.ts         # API client setup
│   │   ├── llm-service.ts       # Dual-LLM orchestration
│   │   └── prompt-templates.ts  # System prompts (CRITICAL)
│   │
│   ├── store/
│   │   └── chatStore.ts         # Zustand state management
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   └── styles/
│       └── index.css            # Global styles + Tailwind
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env                      # API key (not committed)
```

## Key Implementation Details

### The Critic System Prompt

The educational impact comes from the critic's system prompt in `src/services/prompt-templates.ts`. This prompt instructs LLM #2 to analyze:

- **Assumptions & Biases**: What's treated as "normal" or "universal"?
- **Missing Perspectives**: Whose voices are absent?
- **Power Dynamics**: Who benefits from this framing?
- **Information Asymmetries**: What knowledge is assumed or privileged?
- **Language & Framing**: What word choices reveal bias?

### API Configuration

- **Model**: `claude-sonnet-4-5-20250929` for both LLMs
- **Temperature**: 0.7 for Answerer (conversational), 0.5 for Critic (analytical)
- **Max Tokens**: 2048 for Answerer, 3072 for Critic (longer analysis)

### Security Note

This implementation uses `dangerouslyAllowBrowser: true` in the Anthropic client for local classroom demonstrations. **This is NOT suitable for production**. For production apps, API calls should be proxied through a backend server.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### API Key Errors

**Error**: "Invalid API key"
- Check that your API key starts with `sk-ant-`
- Verify the key is active in [Anthropic Console](https://console.anthropic.com/)
- Ensure `.env` file is in the project root (not in `src/`)

### Rate Limiting

**Error**: "Rate limit exceeded"
- Wait a few seconds between requests
- Consider upgrading your Anthropic API plan for classroom use

### Network Errors

**Error**: "API error: Failed to fetch"
- Check your internet connection
- Verify no firewall/proxy blocking anthropic.com
- Try disabling VPN if applicable

### Build Errors

If `npm install` fails:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Educational Objectives

This tool helps students understand:

1. **AI is not neutral**: Every AI response embeds assumptions and biases
2. **Framing matters**: How questions are asked shapes what gets answered
3. **Missing perspectives**: Dominant narratives marginalize some voices
4. **Power dynamics**: Who benefits from AI's default framings?
5. **Critical thinking**: Always question what's presented as objective or universal

## Future Enhancements

Potential additions for future versions:

- **Model Comparison**: Compare responses from Claude, GPT, Gemini
- **Export Conversations**: Download as PDF for class discussion
- **Custom Critique Focus**: Let students choose what to analyze
- **Example Questions**: Dropdown with curated questions
- **Prompt Editing**: Advanced mode to modify system prompts

## License

Educational use for GSBGID517 course.

## Support

For issues or questions:
- Check the Troubleshooting section above
- Review the example questions for inspiration
- Experiment with different phrasings of the same question

## Acknowledgments

Built for GSBGID517 to explore AI bias, power dynamics, and information asymmetries in business and society.
