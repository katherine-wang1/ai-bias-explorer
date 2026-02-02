# Testing Guide

## Pre-Launch Checklist

### 1. Setup Verification

- [ ] `npm install` completes without errors
- [ ] `.env` file exists with valid API key
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts server on port 5173

### 2. Initial Load

- [ ] App loads without console errors
- [ ] Welcome screen displays with example questions
- [ ] Header shows "AI Bias Explorer" and course code
- [ ] Input field is focused and ready

### 3. API Key Flow (if .env not present)

- [ ] API key setup screen appears
- [ ] Can enter API key
- [ ] "Start Exploring" button enables when key entered
- [ ] App loads after submitting key

### 4. First Question

Test with: "What are the best practices for hiring?"

- [ ] Question appears in chat history (indigo background)
- [ ] "Getting initial response..." loading indicator shows
- [ ] Original answer appears on left (gray background, 🤖 icon)
- [ ] "Analyzing for biases..." loading indicator shows
- [ ] Critical analysis appears on right (amber background, 🔍 icon)
- [ ] Both responses are readable and well-formatted

### 5. Critical Analysis Quality

The critique should include sections for:

- [ ] Assumptions & Biases
- [ ] Missing Perspectives
- [ ] Power Dynamics
- [ ] Information Asymmetries
- [ ] Language & Framing

Content should:
- [ ] Quote specific phrases from the original answer
- [ ] Identify non-obvious biases
- [ ] Mention diverse perspectives (race, gender, class, geography)
- [ ] Be educational, not preachy

### 6. Multiple Questions

Ask 3-4 different questions:

- [ ] Each question/response pair displays correctly
- [ ] Chat history auto-scrolls to newest message
- [ ] Previous conversations remain visible
- [ ] No performance issues with multiple messages

### 7. Responsive Design

Test on different screen sizes:

- [ ] Desktop: Two columns side-by-side ✅
- [ ] Tablet: Two columns still work
- [ ] Mobile: Responses stack vertically
- [ ] Input field and button resize appropriately
- [ ] No horizontal scrolling

### 8. Error Handling

**Test invalid API key:**
- [ ] Shows "Invalid API key" error message
- [ ] Error is displayed in red box
- [ ] Can try another question after error

**Test network issues (disconnect WiFi):**
- [ ] Shows appropriate error message
- [ ] App doesn't crash
- [ ] Can retry when connection restored

### 9. UI/UX Polish

- [ ] Loading animations are smooth
- [ ] Transitions feel responsive
- [ ] Colors are readable (text contrast)
- [ ] Icons render properly (💬, 🤖, 🔍)
- [ ] "Clear History" button works
- [ ] Scrollbar appears when needed

### 10. Educational Impact

Test with bias-revealing questions:

**Question**: "How should we address poverty?"
- [ ] Original answer provides some suggestions
- [ ] Critique reveals individual vs. systemic framing
- [ ] Critique mentions missing lived experiences
- [ ] Critique identifies who benefits from certain approaches

**Question**: "What makes a good leader?"
- [ ] Critique reveals Western/masculine assumptions
- [ ] Critique mentions missing cultural perspectives
- [ ] Critique discusses power dynamics

## Suggested Test Questions

### High-Impact Questions (Best for Demos)

1. "What are the best practices for hiring?"
   - Reveals merit bias, colorblindness issues

2. "How should we address poverty?"
   - Reveals individual vs. systemic framing

3. "What makes a good leader?"
   - Reveals Western, masculine assumptions

4. "What is professional attire?"
   - Reveals cultural and class biases

5. "How can we improve student performance?"
   - Reveals standardized testing bias

### Edge Cases to Test

1. Very short question: "What is success?"
2. Very long question: 2-3 sentences
3. Technical question: "How does blockchain work?"
4. Personal question: "How should I invest my money?"
5. Question with typos: "Whaat are best pratices for hyring?"

## Performance Benchmarks

- [ ] First response arrives within 5 seconds
- [ ] Second response arrives within 10 seconds total
- [ ] UI remains responsive during API calls
- [ ] No memory leaks after 10+ questions

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Safari
- [ ] Firefox

## Production Build

- [ ] `npm run build` succeeds
- [ ] `npm run preview` serves correctly
- [ ] Built files are in `dist/`
- [ ] Production build loads and works

## Known Limitations

These are expected and don't need fixes:

- API calls are made from browser (for educational demo)
- No conversation persistence (refresh clears history)
- No user authentication
- No rate limiting UI (relies on Anthropic's limits)
- Single API key for whole class (instructor's key)

## Success Criteria

✅ **Technical**: App runs without errors, both LLMs respond
✅ **Educational**: Critiques reveal non-obvious biases and perspectives
✅ **Usable**: Instructor can demo in <5 minutes, students can use independently

## Troubleshooting Common Issues

**Issue**: "Module not found" errors
- Solution: `rm -rf node_modules && npm install`

**Issue**: TypeScript errors on build
- Solution: Check `src/vite-env.d.ts` exists

**Issue**: Tailwind styles not applying
- Solution: Check `src/styles/index.css` imports Tailwind directives

**Issue**: API calls fail with CORS
- Solution: This is expected in production; use `.env` for local dev

**Issue**: Responses are too short
- Solution: This is Claude's decision; try more open-ended questions

**Issue**: Critique isn't critical enough
- Solution: Review `CRITIC_SYSTEM_PROMPT` in `src/services/prompt-templates.ts`
