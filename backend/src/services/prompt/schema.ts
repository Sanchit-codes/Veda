import { z } from "zod";

// ── Coercion helpers ─────────────────────────────────────────────────────────

function normaliseType(v: unknown): string {
  if (typeof v !== "string") return "short";
  const s = v.toLowerCase().trim();
  if (s.includes("multiple") || s.includes("mcq") || s.includes("choice")) return "mcq";
  if (s.includes("true") || s.includes("false") || s.includes("tf"))        return "truefalse";
  if (s.includes("long") || s.includes("essay") || s.includes("paragraph")) return "long";
  return "short";
}

function normaliseDifficulty(v: unknown): string {
  if (typeof v !== "string") return "medium";
  const s = v.toLowerCase().trim();
  if (s.includes("easy") || s.includes("low"))                                         return "easy";
  if (s.includes("hard") || s.includes("difficult") || s.includes("challenging"))      return "hard";
  return "medium";
}

function normaliseBloomsLevel(v: unknown): string {
  if (typeof v !== "string") return "understand";
  const s = v.toLowerCase().trim();
  if (s.includes("remember") || s.includes("recall") || s.includes("knowledge"))       return "remember";
  if (s.includes("apply") || s.includes("application"))                                return "apply";
  if (s.includes("analyz") || s.includes("analyse"))                                   return "analyze";
  if (s.includes("evaluat"))                                                            return "evaluate";
  if (s.includes("creat") || s.includes("synthes"))                                    return "create";
  return "understand";
}

// ── Question schema — accepts already-normalised question objects ─────────────

export const questionSchema = z.object({
  text: z.string().min(1),
  type: z
    .string()
    .transform(normaliseType)
    .pipe(z.enum(["mcq", "short", "long", "truefalse"])),
  difficulty: z
    .string()
    .optional()
    .default("medium")
    .transform(normaliseDifficulty)
    .pipe(z.enum(["easy", "medium", "hard"])),
  bloomsLevel: z
    .string()
    .optional()
    .default("understand")
    .transform(normaliseBloomsLevel)
    .pipe(z.enum(["remember", "understand", "apply", "analyze", "evaluate", "create"])),
  marks: z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === "string" ? parseInt(v, 10) || 1 : v))
    .pipe(z.number().int().min(1)),
  options: z.array(z.string()).optional(),
  answer: z.string().min(1).default("See explanation"),
  explanation: z.string().optional(),
});

// ── Section schema — accepts already-normalised section objects ───────────────

export const generatedSectionSchema = z.object({
  label:        z.string().optional().default("A"),
  type:         z.string().transform(normaliseType).pipe(z.enum(["mcq", "short", "long", "truefalse"])),
  instructions: z.string().optional(),
  questions:    z.array(z.unknown()).min(1),
});

export type ValidatedQuestion = z.infer<typeof questionSchema>;
export type ValidatedSection   = z.infer<typeof generatedSectionSchema>;
