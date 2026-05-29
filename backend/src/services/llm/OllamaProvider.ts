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

const MODEL = process.env.OLLAMA_MODEL || "llama2:latest";
const BASE_URL = `${config.ollamaUrl}/v1`;

const SUPPORTED_MODELS = [
  "llama2:latest",
  "llama2:7b",
  "mistral:latest",
  "neural-chat:latest",
  "gemma4-e2b:latest",
  "phi:latest",
  "orca-mini:latest",
];

export class OllamaProvider implements LLMProvider {
  private client: OpenAI;
  private promptBuilder: PromptBuilder;

  constructor() {
    this.client = new OpenAI({
      apiKey: "ollama",
      baseURL: BASE_URL,
      timeout: 120_000,
    });
    this.promptBuilder = new PromptBuilder();
    console.log(`[LLM] OllamaProvider initialised — model=${MODEL} endpoint=${BASE_URL}`);
  }

  async generateSection(input: GenerateSectionInput): Promise<GeneratedSection> {
    const { system, user } = this.buildMessages(input);
    console.log(`[LLM] generateSection — section=${input.sectionIndex} promptLen=${user.length}`);
    const t = Date.now();

    const response = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user",   content: user },
      ],
      temperature: 0.7,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    console.log(`[LLM] generateSection done in ${Date.now() - t}ms — responseLen=${raw.length}`);
    return this.parseSection(raw, input.sectionIndex, input.sectionConfig.type);
  }

  async streamSection(
    input: GenerateSectionInput,
    handlers: StreamHandlers
  ): Promise<GeneratedSection> {
    const { system, user } = this.buildMessages(input);
    console.log(`[LLM] streamSection — section=${input.sectionIndex} type=${input.sectionConfig.type} promptLen=${user.length}`);
    console.log(`[LLM] Calling Ollama (${BASE_URL}, model=${MODEL})…`);

    const t = Date.now();
    let fullText = "";
    let tokenCount = 0;

    try {
      const stream = await this.client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user",   content: user },
        ],
        temperature: 0.7,
        max_tokens: 8192,
        stream: true,
      });

      console.log(`[LLM] Stream connected after ${Date.now() - t}ms`);

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content ?? "";
        if (token) {
          fullText += token;
          tokenCount++;
          if (tokenCount === 1) console.log(`[LLM] First token after ${Date.now() - t}ms`);
          handlers.onToken(token);
        }
      }

      console.log(`[LLM] Stream done — ${tokenCount} tokens, ${fullText.length} chars, ${Date.now() - t}ms`);
      handlers.onComplete();
      return this.parseSection(fullText, input.sectionIndex, input.sectionConfig.type);
    } catch (err: any) {
      console.error(`[LLM] Ollama error: ${err?.message}`);
      throw err;
    }
  }

  async regenerateQuestion(input: RegenerateQuestionInput): Promise<Question> {
    const { question, sourceText, metadata } = input;
    const prompt = this.promptBuilder.buildRegeneratePrompt(
      question.text, question.type, question.marks, sourceText, metadata
    );
    console.log(`[LLM] regenerateQuestion — type=${question.type} marks=${question.marks}`);
    const t = Date.now();

    const response = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: this.promptBuilder.buildSystemPrompt() },
        { role: "user",   content: prompt },
      ],
      temperature: 0.8,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    console.log(`[LLM] regenerateQuestion done in ${Date.now() - t}ms`);

    const normalized = this.normalizeSingleQuestion(
      JSON.parse(this.stripFences(raw)),
      question.type
    );
    const validated = questionSchema.parse(normalized);
    return { _id: nanoid(), ...validated };
  }

  // ── Parsing ────────────────────────────────────────────────────────────────

  private parseSection(raw: string, sectionIndex: number, sectionType: string): GeneratedSection {
    const LABELS = ["A", "B", "C", "D", "E", "F"];
    const cleaned = this.stripFences(raw);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Strategy 2: repair truncated JSON (close open strings + brackets)
      console.warn(`[LLM] JSON.parse failed (rawLen=${cleaned.length}) — trying repair`);
      const repaired = repairTruncatedJSON(cleaned);
      try {
        parsed = JSON.parse(repaired);
        console.log(`[LLM] Repair succeeded`);
      } catch {
        // Strategy 3: extract every complete {...} object from inside the array
        console.warn(`[LLM] Repair failed — extracting individual question objects`);
        const items = extractObjectsFromArray(cleaned);
        if (items.length === 0) {
          console.error(`[LLM] All strategies failed. Raw:\n${raw.slice(0, 500)}`);
          throw new Error(`LLM returned unparseable JSON: ${raw.slice(0, 200)}`);
        }
        console.log(`[LLM] Extracted ${items.length} question object(s) from partial response`);
        // Wrap in the GeneratedSection key so the normalizer picks it up
        parsed = { GeneratedSection: items };
      }
    }

    console.log(`[LLM] Raw top-level keys: ${Object.keys(parsed).join(", ")}`);

    const normalized = this.normalizeSection(parsed, sectionType);
    console.log(`[LLM] After normalization: ${normalized.questions.length} questions`);

    try {
      const validated = generatedSectionSchema.parse(normalized);
      return {
        sectionIndex,
        label: LABELS[sectionIndex] ?? String(sectionIndex + 1),
        type: validated.type as any,
        instructions: validated.instructions,
        questions: (validated as any).questions.map((q: any) => ({
          _id: nanoid(),
          ...q,
          options: q.options ?? undefined,
        })),
      };
    } catch (err: any) {
      console.error(`[LLM] Zod validation failed: ${JSON.stringify(err?.issues ?? err?.message)}`);
      throw err;
    }
  }

  // ── Normalizers ───────────────────────────────────────────────────────────

  /** Transforms any model output shape into { label, type, instructions, questions[] } */
  private normalizeSection(raw: Record<string, unknown>, sectionType: string): Record<string, unknown> {
    let data: Record<string, unknown> = raw;

    // Unwrap common wrapper keys — handle BOTH object and array values
    const wrappers = ["GeneratedSection", "generatedSection", "section", "Section", "data", "output", "result", "content"];
    for (const key of wrappers) {
      if (!raw[key]) continue;

      // Wrapper value is an ARRAY → treat it directly as the questions list
      if (Array.isArray(raw[key])) {
        console.log(`[LLM] Unwrapped array key "${key}" — ${(raw[key] as unknown[]).length} items`);
        return {
          label: "A",
          type: sectionType,
          instructions: undefined,
          questions: (raw[key] as unknown[]).map((q) => this.normalizeSingleQuestion(q as any, sectionType)),
        };
      }

      // Wrapper value is an object → unwrap and continue
      if (typeof raw[key] === "object") {
        data = raw[key] as Record<string, unknown>;
        console.log(`[LLM] Unwrapped object key "${key}"`);
        break;
      }
    }

    // Extract questions array
    const questions = this.extractQuestions(data, sectionType);

    return {
      label: (data.label ?? data.sectionLabel ?? data.title ?? data.sectionTitle ?? "A") as string,
      type:  sectionType,  // trust our config, not the model
      instructions: (data.instructions ?? data.description ?? undefined) as string | undefined,
      questions,
    };
  }

  /** Find questions regardless of key name or structure */
  private extractQuestions(data: Record<string, unknown>, sectionType: string): unknown[] {
    // 1. Standard array keys
    for (const key of ["questions", "Questions", "questionList", "items", "questionItems", "questionsList"]) {
      if (Array.isArray(data[key]) && (data[key] as unknown[]).length > 0) {
        console.log(`[LLM] Found questions under key "${key}"`);
        return (data[key] as unknown[]).map((q) => this.normalizeSingleQuestion(q as any, sectionType));
      }
    }

    // 2. question_1, question_2, … or q1, q2, … keyed objects
    const qKeys = Object.keys(data).filter(
      (k) => /^(question[_\s]?\d+|q\d+)$/i.test(k)
    ).sort();
    if (qKeys.length > 0) {
      console.log(`[LLM] Found ${qKeys.length} question keys: ${qKeys.join(", ")}`);
      return qKeys.map((k) => this.normalizeSingleQuestion(data[k] as any, sectionType));
    }

    // 3. Last resort — any value that is an array of objects
    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
        console.log(`[LLM] Using fallback array from key "${key}"`);
        return (val as any[]).map((q) => this.normalizeSingleQuestion(q, sectionType));
      }
    }

    console.warn(`[LLM] Could not find questions in: ${Object.keys(data).join(", ")}`);
    return [];
  }

  /** Maps a single question object from any model format to our internal format */
  private normalizeSingleQuestion(q: Record<string, unknown>, sectionType: string): Record<string, unknown> {
    // Text — handle every field name the model has used so far
    const text = String(
      q.text ?? q.question ?? q.questionText ?? q.question_text ??
      q.stem ?? q.content ?? q.q ?? ""
    );

    // Options — could be array or {a:..., b:..., c:..., d:...} object
    let options: string[] | undefined;
    if (Array.isArray(q.options) && q.options.length > 0) {
      options = (q.options as any[]).map((o: any) => {
        if (typeof o === "string") return o;
        return String(o.text ?? o.value ?? o.option ?? o);
      });
    } else if (q.options && typeof q.options === "object" && !Array.isArray(q.options)) {
      // {a: "...", b: "...", c: "...", d: "..."}
      options = Object.values(q.options as Record<string, unknown>).map(String);
    } else if (q.choices) {
      // Same handling for "choices" key
      if (Array.isArray(q.choices)) {
        options = (q.choices as any[]).map((o: any) =>
          typeof o === "string" ? o : String(o.text ?? o.value ?? o)
        );
      } else if (typeof q.choices === "object") {
        options = Object.values(q.choices as Record<string, unknown>).map(String);
      }
    }

    // Answer — resolve letter reference (e.g. "c") to full text
    let answer = String(
      q.answer ?? q.correct_answer ?? q.correctAnswer ??
      q.correct_option ?? q.correctOption ?? q.correct ?? ""
    );
    if (answer && /^[a-d]$/i.test(answer.trim())) {
      // Single letter — resolve from options object
      const optObj = q.options ?? q.choices;
      if (optObj && typeof optObj === "object" && !Array.isArray(optObj)) {
        const resolved = (optObj as Record<string, unknown>)[answer.toLowerCase()];
        if (resolved) answer = String(resolved);
      } else if (options) {
        const idx = answer.toLowerCase().charCodeAt(0) - 97;
        if (options[idx]) answer = options[idx];
      }
    }
    // Strip "a) " prefix if model included it
    answer = answer.replace(/^[a-d][).]\s*/i, "").trim() || "See explanation";

    // Type
    const type = String(q.type ?? q.questionType ?? q.question_type ?? sectionType);

    // Difficulty
    const difficulty = String(q.difficulty ?? q.difficultyLevel ?? q.level ?? "medium");

    // Blooms
    const bloomsLevel = String(
      q.bloomsLevel ?? q.blooms ?? q.bloomLevel ?? q.bloom_level ?? q.taxonomyLevel ?? "understand"
    );

    // Marks
    const marksRaw = q.marks ?? q.points ?? q.mark ?? q.score ?? 1;
    const marks = typeof marksRaw === "number" ? marksRaw : parseInt(String(marksRaw), 10) || 1;

    // Explanation
    const explanation = String(q.explanation ?? q.rationale ?? q.reason ?? q.hint ?? "");

    return { text, type, difficulty, bloomsLevel, marks, options, answer, explanation };
  }

  private buildMessages(input: GenerateSectionInput) {
    return {
      system: this.promptBuilder.buildSystemPrompt(),
      user:   this.promptBuilder.buildUserPrompt(input),
    };
  }

  private stripFences(raw: string): string {
    return raw.trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
}

/**
 * Scans the raw string for complete top-level {...} objects inside the first
 * array ([...]) it finds, parses each one individually, and returns those that
 * are valid JSON. Partial/incomplete last objects are ignored.
 *
 * Works even when the outer structure is truncated — as long as at least one
 * inner object was fully emitted before truncation.
 */
function extractObjectsFromArray(raw: string): Record<string, unknown>[] {
  // Find the first opening bracket (start of the questions array)
  const arrayStart = raw.indexOf("[");
  if (arrayStart === -1) return [];

  const content = raw.slice(arrayStart + 1);
  const results: Record<string, unknown>[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];

    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const objStr = content.slice(start, i + 1);
        try {
          results.push(JSON.parse(objStr) as Record<string, unknown>);
        } catch {
          // malformed individual object — skip it
        }
        start = -1;
      }
    }
  }

  // If a partial last object exists, attempt repair on it
  if (start !== -1 && depth > 0) {
    const partial = content.slice(start);
    try {
      results.push(JSON.parse(repairTruncatedJSON(partial)) as Record<string, unknown>);
    } catch {
      // still unparseable — drop it
    }
  }

  return results;
}

/**
 * Attempts to repair truncated JSON by:
 * 1. Closing any open string literal
 * 2. Closing all unclosed { and [ in reverse order
 *
 * E.g. {"questions":[{"text":"foo","answer":"bar  →  {"questions":[{"text":"foo","answer":"bar"}]}
 */
function repairTruncatedJSON(raw: string): string {
  let inString = false;
  let escaped = false;
  const stack: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && inString) { escaped = true; continue; }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }

  let repaired = raw;

  // Close any open string
  if (inString) repaired += '"';

  // Remove trailing comma before we close — e.g. {"a":1,}
  repaired = repaired.trimEnd().replace(/,\s*$/, "");

  // Close all open structures in reverse
  while (stack.length > 0) {
    repaired += stack.pop();
  }

  return repaired;
}
