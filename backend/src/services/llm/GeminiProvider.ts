import { GoogleGenAI } from "@google/genai";
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

const MODEL = "gemma-4-26b-a4b-it";

export class GeminiProvider implements LLMProvider {
  private ai: GoogleGenAI;
  private promptBuilder: PromptBuilder;

  constructor() {
    // ── Gemini active config (kept for reference — currently replaced by OllamaProvider) ──
    this.ai = new GoogleGenAI({ apiKey: config.geminiKey });
    this.promptBuilder = new PromptBuilder();
    console.log(`[LLM] GeminiProvider initialised — model=${MODEL}`);
  }

  async generateSection(input: GenerateSectionInput): Promise<GeneratedSection> {
    const { system, user } = this.buildMessages(input);
    console.log(`[LLM] generateSection — section=${input.sectionIndex} promptLen=${user.length}`);
    const t = Date.now();

    const response = await this.ai.models.generateContent({
      model: MODEL,
      config: { systemInstruction: system },
      contents: [{ role: "user", parts: [{ text: user }] }],
    });

    const raw = response.text ?? "";
    console.log(`[LLM] generateSection done in ${Date.now() - t}ms — responseLen=${raw.length}`);
    return this.parseSection(raw, input.sectionIndex);
  }

  async streamSection(
    input: GenerateSectionInput,
    handlers: StreamHandlers
  ): Promise<GeneratedSection> {
    const { system, user } = this.buildMessages(input);
    console.log(`[LLM] streamSection — section=${input.sectionIndex} type=${input.sectionConfig.type} promptLen=${user.length}`);
    console.log(`[LLM] Calling Gemini API (model=${MODEL})…`);

    const t = Date.now();
    let fullText = "";
    let tokenCount = 0;

    try {
      const stream = await this.ai.models.generateContentStream({
        model: MODEL,
        config: { systemInstruction: system },
        contents: [{ role: "user", parts: [{ text: user }] }],
      });

      console.log(`[LLM] Stream connected after ${Date.now() - t}ms`);

      for await (const chunk of stream) {
        const token = chunk.text ?? "";
        if (token) {
          fullText += token;
          tokenCount++;
          if (tokenCount === 1) {
            console.log(`[LLM] First token after ${Date.now() - t}ms`);
          }
          handlers.onToken(token);
        }
      }

      console.log(`[LLM] Stream done — ${tokenCount} tokens, ${fullText.length} chars, ${Date.now() - t}ms`);
      handlers.onComplete();
      return this.parseSection(fullText, input.sectionIndex);
    } catch (err: any) {
      console.error(`[LLM] Gemini stream error: ${err?.message}`);
      console.error(`[LLM] Status: ${err?.status ?? "unknown"}`);
      throw err;
    }
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

    const response = await this.ai.models.generateContent({
      model: MODEL,
      config: { systemInstruction: this.promptBuilder.buildSystemPrompt() },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = response.text ?? "";
    console.log(`[LLM] regenerateQuestion done in ${Date.now() - t}ms`);

    const cleaned = this.stripFences(raw);
    const parsed = JSON.parse(cleaned);
    const validated = questionSchema.parse(parsed);
    return { _id: nanoid(), ...validated };
  }

  private buildMessages(input: GenerateSectionInput) {
    return {
      system: this.promptBuilder.buildSystemPrompt(),
      user: this.promptBuilder.buildUserPrompt(input),
    };
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
      console.error(`[LLM] Top-level keys: ${Object.keys(parsed).join(", ")}`);
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
