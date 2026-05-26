import type {
  GenerateSectionInput,
  GeneratedSection,
  StreamHandlers,
  RegenerateQuestionInput,
  Question,
} from "../../types";

export interface LLMProvider {
  generateSection(input: GenerateSectionInput): Promise<GeneratedSection>;
  streamSection(
    input: GenerateSectionInput,
    handlers: StreamHandlers
  ): Promise<GeneratedSection>;
  regenerateQuestion(input: RegenerateQuestionInput): Promise<Question>;
}
