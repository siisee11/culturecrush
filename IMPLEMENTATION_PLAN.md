# Implementation Plan - Culture Crush (컬쳐크러시)

## Goal Description
Build a "premium & playful" MVP web application that analyzes meeting transcripts against company core values. The app will use Next.js for the framework, Vanilla CSS (CSS Modules) for high-fidelity styling, and an LLM (OpenAI) for analysis. It must be ephemeral (no DB) and feature-rich with gamification elements.

## User Review Required
> [!IMPORTANT]
> **OpenAI API Key**: Since this is a local/MVP setup, we will use a `.env.local` file for the API Key. Ensure you have a valid OpenAI API key ready.

> [!NOTE]
> **Styling Strategy**: As requested, we will use **Vanilla CSS (CSS Modules)** instead of Tailwind to achieve a custom, premium "Duolingo-like" aesthetic with full control over animations and layout.

## Proposed Changes

### 1. Project Initialization
- Initialize Next.js 14+ (App Router) with TypeScript.
- Clean up default global styles.
- Create `styles/variables.css` for color palette (Vibrant Green, Orange, Soft Cream, Deep Navy) and typography tokens.

### 2. Core Architecture (`apps/web`)

#### [NEW] Data Layer (Zustand Store)
- `useAppStore.ts`:
    - `coreValues`: string[]
    - `transcript`: text
    - `analysisResult`: Object (Segments with scores, Speakers, summary)
    - `status`: 'idle' | 'analyzing' | 'done' | 'error'
    - `isCeoMode`: boolean (toggled via console or URL)

#### [NEW] API Route (`app/api/analyze/route.ts`)
- **POST Endpoint**:
    - Receives: `{ transcript: string, coreValues: string[] }`
    - Process:
        1. Construct System Prompt for LLM.
        2. "Speaker Parsing" + "Sentiment/Alignment Scoring (-5 to 5)" in one go (or two steps if needed for quality).
        3. Return JSON: `[{ speaker: "A", text: "...", scores: { "Value1": 5, "Value2": -1 } }, ...]`

### 3. UI Components (Mobile-First, Responsive)

#### `components/layout/`
- `Layout.tsx`: Main container with premium background handling (Light/Dark support foundation).
- `Header.tsx`: Simple logo/branding.

#### `components/setup/`
- `CoreValueInput.tsx`: Tag-input style component. Enter adds a tag. Backspace removes. Colorful distinct badges for each value.
- `TranscriptInput.tsx`: Large textarea with placeholder examples.

#### `components/analysis/`
- `LoadingScreen.tsx`: 
    - Full-screen overlay.
    - **Gamification**: Animated characters or progress bars with fun messages ("Listening to the meeting...", "Calculating XP...", "Finding the champion...").

#### `components/results/`
- `TranscriptViewer.tsx`:
    - Renders parsed dialogue bubbles.
    - **Logic**:
        - If `score >= 3`: Apply "Positive Highlight" (Underline/Background color matching Value).
        - If `score <= -1` AND `isCeoMode`: Apply "Warning Highlight" (Red wavy underline).
    - **Hover**: Tooltip showing strict score and matched value.
- `AlignmentReport.tsx`:
    - **Summary Section**: Brief meeting summary.
    - **Gamified Stats**:
        - "Value Champion": Speaker with highest cumulative score.
        - "XP Bars": Visual bar charts per speaker.
        - "Badges": Fun icons depending on alignment type.

### 4. Implementation Steps Phase

#### Step 1: Bootstrap & Design System
- `npx create-next-app`
- Define CSS Variables (Colors, Fonts, Spacing).
- Setup Zustand.

#### Step 2: Input Flow
- Implement `CoreValueInput` & `TranscriptInput`.
- Create basic `api/analyze` mock to test frontend flow without burning tokens initially.

#### Step 3: API & LLM Integration
- Implement real OpenAI call.
- Prompt Engineering: Ensure JSON output is strictly formatted for parsing.
- Handle "Speaker Separation" heuristics in the prompt.

#### Step 4: Results & Gamification
- Build `TranscriptViewer` with hover interactions.
- Build `AlignmentReport` with CSS-based XP bars and animations.
- Add "CEO Mode" trigger.

## Verification Plan

### Automated Tests
- We will rely mainly on manual verification for this MVP UI-heavy task.
- Can add basic unit tests for the "Score Calculation" logic if complex.

### Manual Verification
- **Input**: Use `MEETING_NOTE_EXAMPLE.md` content.
- **Process**: Verify "Loading" animation plays.
- **Output**:
    - Check if "Speaker 1" and "Speaker 2" are correctly separated.
    - Hover over positive sentences -> Check positive score (+3~5).
    - Enable CEO Mode (`window.ceo=true`) -> Check if negative sentences (-1~-5) appear with warnings.
