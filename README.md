# VedaAI — AI Assessment Creator

A full-stack application that leverages AI to generate structured exam papers from curriculum PDFs. Teachers define sections, mark allocations, and question types—VedaAI handles the rest, producing Bloom's-aware, difficulty-balanced questions ready to edit and export.

**Built with**: Next.js 16 • Express • MongoDB • Redis • BullMQ • TypeScript

---

## ⚠️ Important Note

**This project was tested exclusively with Ollama running `gemma4-e2b:latest`.** Due to time restrictions, the prompt engineering and response parsing are tuned for this model. 

If you use a different LLM provider:
- **Response format validation may fail** — the Zod schemas expect specific JSON structures
- **Parsing errors are likely** — the normalizer handles Gemma's quirks (wrapper keys, format variations)
- **Token efficiency differs** — prompts assume Gemma's context window and latency profile
- **Quality of questions may vary** — difficulty distribution and Bloom's level accuracy are calibrated for Gemma

To use with other providers (GPT-4o, Claude, Gemini, etc.), you'll need to:
1. Re-tune the system and user prompts in `PromptBuilder.ts`
2. Test and adjust the Zod validation schemas
3. Update the normalizers in `OllamaProvider.ts` to handle new response formats

Pull requests adapting this for other LLMs are welcome!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ or Bun
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Ollama with `gemma4-e2b` model running on `http://localhost:11434`

### Setup

```bash
# Clone and install
git clone https://github.com/yourusername/vedaai.git
cd vedaai
bun install

# Set environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your config:
# - MONGODB_URI
# - REDIS_URL
# - OLLAMA_URL (http://localhost:11434)
```

### Run Locally

```bash
# Terminal 1: Backend
cd backend
bun run dev          # Runs on http://localhost:4000

# Terminal 2: Frontend
cd frontend
bun run dev          # Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 📋 Features

### ✅ Core
- **Section-wise generation** — Create MCQ, short answer, long answer, and true/false sections independently
- **Bloom's taxonomy integration** — Each question tagged with cognitive level (remember → create)
- **Difficulty labeling** — Easy, medium, hard distribution
- **WebSocket streaming** — Live progress updates as questions are generated
- **PDF text extraction** — Upload source materials; AI learns from them
- **Question editability** — Edit, regenerate, or manually adjust any question post-generation
- **Answer key** — Separate view with answers and explanations
- **PDF export** — Print-ready exam papers

### 🔧 Backend Architecture
- **LLM provider abstraction** — Swap providers (Ollama, Gemini, OpenAI) via interface
- **BullMQ job queue** — Reliable async generation with retries
- **Room-based WebSocket** — Real-time updates per assignment
- **Structured prompts** — Explicit JSON schema; Zod validation before rendering
- **PDF parsing** — Extract text from uploaded source documents
- **Redis caching** — Cache frequently accessed data

### 🎨 Frontend
- **Next.js 16** with Turbopack
- **Zustand** for state management
- **Tailwind CSS** for styling
- **TypeScript** with strict mode
- **Real-time socket.io** integration
- **Responsive design** (desktop-first, mobile support)

---

## 🏗️ Project Structure

```
vedaai/
├── frontend/                    # Next.js app
│   ├── src/
│   │   ├── app/               # Pages (assignments, generation, output)
│   │   ├── components/        # UI components
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # API, socket, hooks
│   │   └── types/             # TypeScript interfaces
│   ├── next.config.ts
│   └── package.json
│
├── backend/                     # Express server
│   ├── src/
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # LLM, PDF, WebSocket
│   │   ├── workers/           # BullMQ job processors
│   │   ├── middleware/        # Auth, error handling
│   │   ├── types/             # Shared TypeScript
│   │   ├── queues/            # Job queue setup
│   │   └── config.ts
│   └── package.json
│
├── docker/                      # Docker & compose configs
├── CLAUDE.md                    # Developer guide
├── PRD.md                       # Product requirements
└── package.json                 # Monorepo root
```

---

## 🔄 Workflow

1. **Create Assignment**
   - Teacher fills in title, subject, class, school
   - Uploads PDF source material (optional)
   - Defines section configs: question type, count, marks per question

2. **Submit for Generation**
   - Frontend sends assignment to backend
   - Backend enqueues one job per section
   - BullMQ worker picks up job, fetches source docs, calls LLM
   - LLM streams tokens → WebSocket broadcasts to frontend in real-time

3. **Validate & Edit**
   - Frontend renders streamed questions as they arrive
   - Teacher can edit text, change marks, regenerate individual questions
   - All changes validated against schema

4. **Export & Distribute**
   - View answer key with explanations
   - Export to PDF for printing
   - Ready to distribute to students

---

## 🔌 API Overview

### REST
- `POST /api/assignments` — Create assignment
- `GET /api/assignments/:id` — Fetch with sections
- `POST /api/assignments/:id/generate` — Trigger generation
- `PATCH /api/assignments/:id/sections/:sectionId/questions/:questionId` — Edit question
- `POST /api/assignments/:id/files` — Upload source documents

### WebSocket Events
- `job:queued` — Generation started
- `section:stream` — Token received
- `section:completed` — Section finished
- `job:completed` — All sections done
- `question:regenerated` — Single question re-generated

---

## 🛠️ Development

### Scripts
```bash
bun run dev       # Start dev servers (frontend + backend)
bun run build     # Build for production
bun run test      # Run tests
```

### Testing with Different LLMs

**To test with OpenAI (GPT-4o):**
1. Swap provider in `backend/src/index.ts`: `new OpenAIProvider()`
2. Update `PromptBuilder` prompts
3. Adjust `OllamaProvider.normalizeSection()` logic
4. Test response parsing against actual LLM outputs

**To test with Gemini:**
1. Use `GeminiProvider` (stub exists)
2. Implement streaming response handling
3. Test Zod schema validation

---

## 📦 Dependencies

### Frontend
- next@16
- react@19
- zustand (state)
- axios (HTTP)
- socket.io-client (WebSocket)
- tailwindcss (styling)

### Backend
- express (server)
- mongoose (MongoDB)
- bullmq (job queue)
- socket.io (WebSocket)
- zod (validation)
- pdf-parse (text extraction)

---

## 🔐 Security

- **Environment variables** in `.env.local` (never committed)
- **CORS** configured for localhost
- **Helmet.js** security headers
- **Input validation** with Zod schemas
- **Rate limiting** placeholder in config

⚠️ **Not production-ready**: Add authentication (JWT), RBAC, encrypted storage, and audit logging before deploying.

---

## 🚀 Deployment

### Docker
```bash
docker-compose up --build
```

### Vercel (Frontend)
```bash
vercel deploy
```

### Backend Hosting
- Railway, Render, Heroku, or self-hosted VPS
- Ensure MongoDB, Redis, and Ollama are accessible

---

## 📝 License

MIT — See `LICENSE` file.

---

## 🤝 Contributing

See `CONTRIBUTING.md` for guidelines on setting up, testing, and submitting pull requests.

---

## 📧 Questions?

Open an issue or refer to the `CLAUDE.md` and `PRD.md` files for architectural details.

---

**Happy question-generating!** 🎓✨
