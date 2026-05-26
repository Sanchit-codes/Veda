import type { GenerateSectionInput } from "../../types";

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice Questions (4 options each, exactly one correct)",
  short: "Short Answer Questions (2-4 sentences expected)",
  long: "Long Answer Questions (paragraph-length expected)",
  truefalse: "True / False Questions",
};

export class PromptBuilder {
  buildSystemPrompt(): string {
    return `You are an expert educational content creator specializing in Indian school curricula (CBSE/ICSE).
Your task is to generate structured exam questions suitable for the given class and subject.

CRITICAL OUTPUT RULES:
- Your ENTIRE response must be a single valid JSON object.
- Do NOT include markdown fences (\`\`\`json), explanations, or any text before or after the JSON.
- Do NOT include comments inside the JSON.
- Start your response with { and end with }`;
  }

  buildUserPrompt(input: GenerateSectionInput): string {
    const { sectionConfig, sectionIndex, sourceText, metadata } = input;
    const sectionLabel = String.fromCharCode(65 + sectionIndex);
    const typeLabel = TYPE_LABELS[sectionConfig.type] ?? sectionConfig.type;

    // Minimal schema hint — keep prompt short so small models don't truncate
    const schemaStr = `{
  "GeneratedSection": [
    {
      "question": "...",
      "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "correct_option": "a|b|c|d",
      "explanation": "..."
    }
  ]
}`;

    const hasSource = sourceText && sourceText.trim().length > 20;
    const truncatedSource = hasSource
      ? sourceText.length > 6000
        ? sourceText.slice(0, 6000) + "\n...[truncated]"
        : sourceText
      : null;

    const sourceSection = truncatedSource
      ? `SOURCE MATERIAL (base your questions on this):\n${truncatedSource}`
      : `SOURCE MATERIAL: Not provided. Generate questions based on standard CBSE/ICSE ${metadata.subject} curriculum for Class ${metadata.className}.`;

    const syllabusSection = metadata.syllabusText?.trim()
      ? `\nSYLLABUS / TOPICS (questions must cover these):\n${metadata.syllabusText.slice(0, 2000)}`
      : "";

    return `Generate Section ${sectionLabel} for a ${metadata.subject} exam for Class ${metadata.className} at ${metadata.schoolName}.

SECTION REQUIREMENTS:
- Question type: ${typeLabel}
- Number of questions: ${sectionConfig.questionCount}
- Marks per question: ${sectionConfig.marksPerQuestion}
${sectionConfig.instructions ? `- Special instructions: ${sectionConfig.instructions}` : ""}
${metadata.additionalInstructions ? `- Additional context: ${metadata.additionalInstructions}` : ""}${syllabusSection}

${sourceSection}

GENERATION RULES:
1. ${hasSource ? "All questions must be directly based on the source material above." : "Questions must follow standard CBSE/ICSE syllabus for the given class and subject."}
2. Difficulty distribution: ~30% easy, ~50% medium, ~20% hard.
3. Vary Bloom's taxonomy levels: remember, understand, apply, analyze, evaluate, create.
4. For MCQ: provide exactly 4 options (a, b, c, d), only one correct.
5. For True/False: the "answer" field must be exactly "True" or "False".
6. Include a concise explanation for each answer.
7. Questions must be age-appropriate for Class ${metadata.className}.

Return ONLY a JSON object matching this exact schema (no other text):
${schemaStr}`;
  }

  buildRegeneratePrompt(
    questionText: string,
    type: string,
    marks: number,
    sourceText: string,
    metadata: GenerateSectionInput["metadata"]
  ): string {
    const hasSource = sourceText && sourceText.trim().length > 20;
    const sourcePart = hasSource
      ? `SOURCE MATERIAL:\n${sourceText.slice(0, 4000)}`
      : `No source material provided. Use standard CBSE/ICSE ${metadata.subject} curriculum for Class ${metadata.className}.`;

    return `Regenerate the following exam question for Class ${metadata.className} ${metadata.subject}.

ORIGINAL QUESTION: "${questionText}"

Create a DIFFERENT question on a related topic. Same type: ${type}, same marks: ${marks}.

${sourcePart}

Return a single JSON object only — no other text:
{
  "text": "...",
  "type": "${type}",
  "difficulty": "easy|medium|hard",
  "bloomsLevel": "remember|understand|apply|analyze|evaluate|create",
  "marks": ${marks},
  ${type === "mcq" ? '"options": ["option A text", "option B text", "option C text", "option D text"],' : ""}
  "answer": "...",
  "explanation": "..."
}`;
  }
}
