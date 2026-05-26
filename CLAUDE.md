# CLAUDE.md

## Project
AI Assessment Creator — full-stack app for teachers to generate structured exam papers from curriculum PDFs using AI. Monorepo with `frontend/` and `backend/`.

## Package Manager
Use **bun** everywhere. Never use npm or yarn.

```sh
bun install
bun run dev
bun run build
bunx <cli-tool>
```

## Stack

### Frontend (`frontend/`)
- Next.js 15 + TypeScript
- Zustand for state
- WebSocket client for real-time updates
- Tailwind CSS

### Backend (`backend/`)
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- Redis + BullMQ for job queues
- WebSocket server (ws or socket.io)
- PDF text extraction (pdf-parse or pdfjs-dist)

## Folder Layout

```
/
  frontend/
    app/
    components/
    features/
      assignment/
      generation/
      output/
    stores/
    lib/
    types/
  backend/
    src/
      routes/
      controllers/
      services/
        llm/
        prompt/
        pdf/
        websocket/
      workers/
      queues/
      models/
      schemas/
      lib/
      types/
  docker/
  docs/
```

## Core Entities

```ts
interface Question {
  id: string
  text: string
  type: 'mcq' | 'short' | 'long' | 'truefalse'
  difficulty: 'easy' | 'medium' | 'hard'
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
  marks: number
  options?: string[]
  answer: string
  explanation?: string
}
```

Entities: `Assignment`, `SourceDocument`, `GeneratedSection`, `Question`, `AnswerKeyEntry`, `GenerationJob`

## LLM Integration

Provider interface:
```ts
interface LLMProvider {
  generateSection(input: GenerateSectionInput): Promise<GeneratedSection>
  streamSection?(input: GenerateSectionInput, handlers: StreamHandlers): Promise<GeneratedSection>
  regenerateQuestion(input: RegenerateQuestionInput): Promise<GeneratedQuestion>
}
```

- Always parse LLM output into typed schema before use — never render raw text
- Use structured prompts with explicit JSON schema expectations
- Keep provider swappable via the abstraction layer

## WebSocket Event Flow

```
Teacher submits section config
→ API stores assignment draft
→ BullMQ section job created
→ worker parses source docs + builds prompt
→ LLM streams partial output
→ WebSocket pushes token/progress events
→ backend validates and stores final structured section
→ frontend updates editable paper and answer key
```

Events: `job:queued`, `job:started`, `section:stream`, `section:completed`, `question:regenerated`, `pdf:ready`, `job:failed`

## Hard Rules
- Generation is **section-wise only** — never generate the full paper in one call
- Every LLM response is parsed and validated before rendering
- All questions must be editable after generation
- Answer key lives on a separate page/tab, not an afterthought
- PDF parsing is required (source material comes as PDFs)

## UI Style
- Soft gray gradient background
- White floating cards with large rounded corners
- Frosted glass top bar
- Fixed left sidebar on desktop
- Pill-shaped dark CTA buttons
- Difficulty + Bloom's level shown as distinct badges
- Output page resembles a real exam paper

## Engineering Priority Order
1. Correct architecture
2. Reliable structured generation
3. UI fidelity to Figma
4. Editability and teacher workflow
5. Polish

## What to Avoid
- Raw LLM text in UI
- Monolithic service files
- Unvalidated JSON from LLM
- Weak empty states
- Hard-coding to a single LLM provider
