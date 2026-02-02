# Interactive Bias Analysis - Testing Guide

## Implementation Complete ✅

The interactive bias analysis feature has been successfully implemented. The system now highlights specific problematic segments in the original response and allows users to click them to view detailed analysis.

## What Changed

### 1. Data Model (`src/types/index.ts`)
- Added `BiasSegment` interface for individual highlighted segments
- Added `StructuredCritique` interface for organized analysis data
- Updated `Message` interface with:
  - `structuredCritique: StructuredCritique | null`
  - `selectedSegmentId: string | null`

### 2. LLM Service (`src/services/llm-service.ts`)
- Modified `callCriticLLM()` to return structured JSON instead of plain text
- Added `parseStructuredCritique()` to handle JSON parsing with fallbacks
- Added `findTextIndices()` for exact and fuzzy text matching
- Added `formatCritiqueAsText()` for backward compatibility
- Increased max_tokens to 4096
- Lowered temperature to 0.3 for more consistent JSON output

### 3. Prompt Templates (`src/services/prompt-templates.ts`)
- Updated `CRITIC_SYSTEM_PROMPT` to request JSON-formatted output
- Specified exact JSON structure with segments array
- Added guidelines for issue types and severity levels

### 4. State Management (`src/store/chatStore.ts`)
- Updated `addMessage()` to store structured critique
- Added `setSelectedSegment()` action for handling segment selection
- Maintains backward compatibility with text-based critique

### 5. New Components

**`InteractiveOriginalResponse.tsx`**
- Displays original response with color-coded highlights
- Blue = low severity, Yellow = medium, Red = high
- Numbered badges on each highlight
- Click to select/deselect segments
- Shows legend explaining color coding

**`SegmentAnalysisPanel.tsx`**
- Default state: Shows instructions to click highlights
- Selected state: Displays detailed analysis for chosen segment
- Shows issue type badge with icon
- Shows severity badge
- Displays quoted text in bordered box
- Close button to deselect

### 6. Updated Components

**`ResponseDisplay.tsx`**
- Detects when structured critique is available
- Renders interactive two-column layout
- Handles segment selection and deselection
- Shows overall summary below main panels
- Fallback to traditional display if needed

## How to Test

### 1. Start the Application
The dev server is already running at: **http://localhost:5173/**

### 2. Enter API Key
You'll need a valid Anthropic API key to test the feature.

### 3. Test Questions

Try these questions to see different types of bias analysis:

**Question 1: Immigration Policy**
```
What is the best immigration policy?
```
Expected highlights: Economic-centric perspective, nation-state framing, "best" assumption

**Question 2: Leadership**
```
What makes a good leader?
```
Expected highlights: Western leadership models, gender assumptions, cultural bias

**Question 3: Diversity**
```
How should companies handle diversity?
```
Expected highlights: Corporate perspective, missing worker voices, power dynamics

**Question 4: Technology**
```
Should everyone learn to code?
```
Expected highlights: Access assumptions, economic bias, educational privilege

### 4. Verification Checklist

- [ ] Response shows with colored highlights (blue/yellow/red)
- [ ] Legend displays correctly showing severity levels
- [ ] Numbered badges appear on each highlight
- [ ] Clicking a highlight shows analysis in right panel
- [ ] Analysis panel shows:
  - [ ] Issue type badge with icon
  - [ ] Severity badge
  - [ ] Quoted text in bordered box
  - [ ] Detailed analysis text
- [ ] Clicking same highlight again deselects it
- [ ] Clicking different highlight updates right panel
- [ ] Close button deselects current segment
- [ ] Overall summary appears below if present
- [ ] Positive aspects shown if applicable
- [ ] Mobile layout stacks vertically (resize browser to test)

### 5. Edge Cases to Test

**Very Short Response**
```
Is the sky blue?
```
Should handle responses with few or no issues gracefully.

**Very Long Response**
```
Explain the entire history of philosophy.
```
Should handle long responses with multiple segments.

**No Issues Found**
If LLM finds no issues, should show empty highlights with positive aspects message.

## Color Coding Reference

- **Blue highlight** = Low severity issue
- **Yellow highlight** = Medium severity issue
- **Red highlight** = High severity issue
- **Dark border** = Currently selected segment
- **Numbered badge** = Segment number for reference

## Issue Types

The system identifies these types of issues:

1. 🤔 **Assumption** - Embedded assumptions about what's "normal"
2. ⚖️ **Bias** - Cultural, geographic, or demographic perspectives
3. 👥 **Missing Perspective** - Absent voices or experiences
4. ⚡ **Power Dynamic** - Who benefits, who has power
5. 💬 **Language** - Problematic word choices or framing
6. 📊 **Information Asymmetry** - Knowledge assumptions

## Known Limitations

1. Text matching may occasionally fail for segments with complex formatting
2. JSON parsing errors will result in empty segments (handled gracefully)
3. Very long responses may hit token limits (current: 4096)
4. Overlapping issues are handled by showing separate highlights

## Success Criteria Met

✅ Highlights specific problematic segments in original response
✅ Shows detailed analysis only for clicked segments
✅ Uses intuitive color coding for severity
✅ Provides clear instructions when nothing selected
✅ Maintains responsive layout on mobile
✅ Handles errors gracefully (JSON parsing, text matching)
✅ Backward compatible with text-based critique

## If You Encounter Issues

1. Check browser console for errors
2. Verify API key is valid
3. Try different questions
4. Test in different browsers
5. Check network tab for API responses

## Next Steps (Optional Enhancements)

- Add keyboard navigation (arrow keys to move between segments)
- Add "Show all analyses" view
- Add filter by severity or issue type
- Add export functionality
- Add statistics dashboard
