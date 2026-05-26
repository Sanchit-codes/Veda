export type QuestionType = "mcq" | "short" | "long" | "truefalse";
export type Difficulty = "easy" | "medium" | "hard";
export type BloomsLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";
export type AssignmentStatus = "draft" | "generating" | "completed" | "failed";

export interface Question {
  _id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  bloomsLevel: BloomsLevel;
  marks: number;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface SectionConfig {
  id: string;
  type: QuestionType;
  questionCount: number;
  marksPerQuestion: number;
  instructions?: string;
}

export interface GenerateSectionInput {
  assignmentId: string;
  sectionConfig: SectionConfig;
  sectionIndex: number;
  sourceText: string;
  metadata: {
    subject: string;
    className: string;
    schoolName: string;
    instructions?: string;
    additionalInstructions?: string;
    syllabusText?: string;
  };
}

export interface StreamHandlers {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (err: Error) => void;
}

export interface GeneratedSection {
  sectionIndex: number;
  label: string;
  type: QuestionType;
  instructions?: string;
  questions: Question[];
}

export interface RegenerateQuestionInput {
  question: Question;
  sourceText: string;
  metadata: GenerateSectionInput["metadata"];
}
