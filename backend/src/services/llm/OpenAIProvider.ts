import OpenAI from "openai";
import { nanoid } from "nanoid";
import type { LLMProvider } from "./LLMProvider";
import type {
  GenerateSectionInput,
  GeneratedSection,
  StreamHandlers,
  RegenerateQuestionInput,
  Question,
} from "../../types";
import { PromptBuilder } from "../prompt/PromptBuilder";
import { generatedSectionSchema, questionSchema } from "../prompt/schema";
import { config } from "../../config";

const STREAM_TIMEOUT_MS = 90_000;   // 90s — free tier can be very slow

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private promptBuilder: PromptBuilder;

  private static readonly MODEL = "moonshotai/kimi-k2.6:free";

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openrouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      timeout: STREAM_TIMEOUT_MS,
      defaultHeaders: {
        "HTTP-Referer": "https://vedaai.app",
        "X-Title": "VedaAI Assessment Creator",
      },
    });
    this.promptBuilder = new PromptBuilder();
    console.log(`[LLM] OpenAIProvider initialised — model=${OpenAIProvider.MODEL}`);
  }

  async generateSection(input: GenerateSectionInput): Promise<GeneratedSection> {
    const prompt = this.promptBuilder.buildUserPrompt(input);
    console.log(`[LLM] generateSection — section=${input.sectionIndex} promptLen=${prompt.length}`);
    const t = Date.now();

    const response = await this.client.chat.completions.create({
      model: OpenAIProvider.MODEL,
      messages: [
        { role: "system", content: this.promptBuilder.buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    console.log(`[LLM] generateSection done in ${Date.now() - t}ms — responseLen=${raw.length}`);
    return this.parseSection(raw, input.sectionIndex);
  }

  async streamSection(
    input: GenerateSectionInput,
    handlers: StreamHandlers
  ): Promise<GeneratedSection> {
    const prompt = this.promptBuilder.buildUserPrompt(input);
    console.log(`[LLM] streamSection — section=${input.sectionIndex} type=${input.sectionConfig.type} promptLen=${prompt.length}`);

    // ── Attempt streaming with a hard timeout ────────────────────────────
    try {
      return await this.streamWithTimeout(input, prompt, handlers);
    } catch (err: any) {
      const isTimeout = err?.message?.includes("timeout") || err?.code === "ETIMEDOUT" || err?.name === "APIConnectionTimeoutError";
      const noStream  = err?.status === 400 || err?.message?.includes("stream");

      if (isTimeout || noStream) {
        console.warn(`[LLM] Streaming failed (${err.message}) — falling back to non-streaming`);
        return await this.generateWithFallback(input, prompt, handlers);
      }
      throw err;
    }
  }

  private async streamWithTimeout(
    input: GenerateSectionInput,
    prompt: string,
    handlers: StreamHandlers
  ): Promise<GeneratedSection> {
    const t = Date.now();
    let fullContent = "";
    let tokenCount = 0;

    console.log(`[LLM] Opening stream to OpenRouter… (timeout=${STREAM_TIMEOUT_MS}ms)`);

    const stream = await this.client.chat.completions.create({
      model: OpenAIProvider.MODEL,
      messages: [
        { role: "system", content: this.promptBuilder.buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      stream: true,
    });
    console.log(`[LLM] Stream connected after ${Date.now() - t}ms`);

    // Wrap the async iterator in a per-chunk timeout so we detect stalled streams
    const CHUNK_TIMEOUT_MS = 30_000;
    for await (const chunk of withChunkTimeout(stream, CHUNK_TIMEOUT_MS)) {
      const token = chunk.choices[0]?.delta?.content ?? "";
      if (token) {
        fullContent += token;
        tokenCount++;
        if (tokenCount === 1) {
          console.log(`[LLM] First token after ${Date.now() - t}ms`);
        }
        handlers.onToken(token);
      }
    }

    console.log(`[LLM] Stream done — ${tokenCount} tokens, ${fullContent.length} chars, ${Date.now() - t}ms`);
    handlers.onComplete();
    return this.parseSection(fullContent, input.sectionIndex);
  }

  /** Non-streaming fallback: calls the API without stream, then emits the full content as one token batch */
  private async generateWithFallback(
    input: GenerateSectionInput,
    prompt: string,
    handlers: StreamHandlers
  ): Promise<GeneratedSection> {
    console.log(`[LLM] Non-stream fallback for section=${input.sectionIndex}`);
    const t = Date.now();

    const response = await this.client.chat.completions.create({
      model: OpenAIProvider.MODEL,
      messages: [
        { role: "system", content: this.promptBuilder.buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    console.log(`[LLM] Non-stream response in ${Date.now() - t}ms — ${raw.length} chars`);

    // Emit the content in chunks so the frontend still sees a streaming-like experience
    const chunkSize = 80;
    for (let i = 0; i < raw.length; i += chunkSize) {
      handlers.onToken(raw.slice(i, i + chunkSize));
      await sleep(20);
    }
    handlers.onComplete();
    return this.parseSection(raw, input.sectionIndex);
  }

  async regenerateQuestion(input: RegenerateQuestionInput): Promise<Question> {
    const { question, sourceText, metadata } = input;
    const prompt = this.promptBuilder.buildRegeneratePrompt(
      question.text,
      question.type,
      question.marks,
      sourceText,
      metadata
    );
    console.log(`[LLM] regenerateQuestion — type=${question.type} marks=${question.marks}`);
    const t = Date.now();

    const response = await this.client.chat.completions.create({
      model: OpenAIProvider.MODEL,
      messages: [
        { role: "system", content: this.promptBuilder.buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    console.log(`[LLM] regenerateQuestion done in ${Date.now() - t}ms`);

    const parsed = JSON.parse(this.stripFences(raw));
    const validated = questionSchema.parse(parsed);
    return { _id: nanoid(), ...validated };
  }

  private parseSection(raw: string, sectionIndex: number): GeneratedSection {
    const LABELS = ["A", "B", "C", "D", "E", "F"];
    const cleaned = this.stripFences(raw);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error(`[LLM] JSON parse failed. Raw (first 400 chars):\n${raw.slice(0, 400)}`);
      throw new Error(`LLM returned invalid JSON: ${raw.slice(0, 200)}`);
    }

    try {
      const validated = generatedSectionSchema.parse(parsed);
      return {
        sectionIndex,
        label: LABELS[sectionIndex] ?? String(sectionIndex + 1),
        type: validated.type,
        instructions: validated.instructions,
        questions: validated.questions.map((q) => ({
          _id: nanoid(),
          ...q,
          options: q.options ?? undefined,
        })),
      };
    } catch (err: any) {
      console.error(`[LLM] Zod validation failed: ${err?.message}`);
      console.error(`[LLM] Top-level keys in response: ${Object.keys(parsed).join(", ")}`);
      throw err;
    }
  }

  private stripFences(raw: string): string {
    return raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Wraps an async iterable and throws if no chunk arrives within `timeoutMs`.
 * Detects stalled streams from slow free-tier models.
 */
async function* withChunkTimeout<T>(
  iter: AsyncIterable<T>,
  timeoutMs: number
): AsyncGenerator<T> {
  const iterator = iter[Symbol.asyncIterator]();
  while (true) {
    const result = await Promise.race([
      iterator.next(),
      sleep(timeoutMs).then(() => {
        throw new Error(`Stream stalled — no chunk received in ${timeoutMs}ms`);
      }),
    ]);
    if ((result as IteratorResult<T>).done) break;
    yield (result as IteratorResult<T>).value;
  }
}
