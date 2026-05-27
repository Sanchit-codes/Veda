export type QuestionType = "mcq" | "short" | "long" | "truefalse";
export type Difficulty = "easy" | "medium" | "hard";
export type BloomsLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";
export type AssignmentStatus =
  | "draft"
  | "generating"
  | "completed"
  | "failed";

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

export interface GeneratedSection {
  _id: string;
  assignmentId: string;
  sectionIndex: number;
  label: string;
  type: QuestionType;
  instructions?: string;
  questions: Question[];
  status: "pending" | "generating" | "completed" | "failed";
}

export interface SourceDocument {
  _id: string;
  filename: string;
  uploadedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate?: string;
  instructions?: string;
  timeAllowed?: number;
  status: AssignmentStatus;
  sections: GeneratedSection[];
  sectionConfigs: SectionConfig[];
  sourceDocIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentListItem {
  _id: string;
  title: string;
  subject: string;
  className: string;
  status: AssignmentStatus;
  createdAt: string;
  dueDate?: string;
  sectionCount: number;
  totalMarks: number;
}
