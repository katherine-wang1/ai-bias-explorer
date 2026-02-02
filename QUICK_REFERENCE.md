# Interactive Bias Analysis - Quick Reference

## What Was Implemented

The bias analysis now uses **interactive highlighting** instead of showing full text analysis.

### Before
- Side-by-side: Original response | Full critique text
- All analysis visible at once
- No way to focus on specific issues

### After
- Side-by-side: Highlighted response | Focused analysis
- Click highlights to see specific analysis
- Color-coded by severity
- Numbered badges for reference

## Color Coding

| Color  | Severity | Meaning |
|--------|----------|---------|
| 🔵 Blue | Low | Minor issue, limited impact |
| 🟡 Yellow | Medium | Significant issue that could mislead |
| 🔴 Red | High | Serious issue with harmful framing |

## Issue Types

| Icon | Type | What It Means |
|------|------|---------------|
| 🤔 | Assumption | Embedded assumptions about "normal" |
| ⚖️ | Bias | Cultural/geographic perspectives |
| 👥 | Missing Perspective | Absent voices or experiences |
| ⚡ | Power Dynamic | Who benefits, who has power |
| 💬 | Language | Problematic word choices |
| 📊 | Information Asymmetry | Knowledge assumptions |

## User Flow

1. User asks question
2. LLM #1 generates response
3. LLM #2 analyzes and returns JSON with segments
4. Response displays with colored highlights
5. User clicks highlight → Analysis shows in right panel
6. User clicks another highlight → Analysis updates
7. User clicks selected highlight again → Deselects
8. User clicks X button → Deselects

## Testing Quick Start

```bash
# Dev server is already running at:
http://localhost:5173/

# Try these test questions:
1. "What is the best immigration policy?"
2. "What makes a good leader?"
3. "How should companies handle diversity?"
```

## Technical Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **State:** Zustand
- **LLM:** Claude Sonnet 4.5 (Anthropic API)
- **Format:** Structured JSON from LLM #2

## Key Components

```
ResponseDisplay
├── InteractiveOriginalResponse
│   ├── Colored highlights
│   ├── Numbered badges
│   └── Legend
└── SegmentAnalysisPanel
    ├── Issue type badge
    ├── Severity badge
    ├── Quoted text
    └── Detailed analysis
```

## Build Status

✅ TypeScript compilation successful
✅ Vite build successful
✅ No errors or warnings
✅ Dev server running
