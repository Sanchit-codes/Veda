import { create } from "zustand";
import { nanoid } from "nanoid";
import type { SectionConfig, QuestionType } from "@/types/assignment";

interface AssignmentDraft {
  step: 0 | 1;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  timeAllowed: number;
  instructions: string;
  uploadedFiles: File[];
  sections: SectionConfig[];
  additionalInstructions: string;
  syllabusText: string;
}

interface AssignmentDraftStore extends AssignmentDraft {
  setStep: (step: 0 | 1) => void;
  setField: <K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]) => void;
  addSection: () => void;
  updateSection: (id: string, patch: Partial<SectionConfig>) => void;
  removeSection: (id: string) => void;
  reset: () => void;
  totalQuestions: () => number;
  totalMarks: () => number;
}

const defaultSection = (): SectionConfig => ({
  id: nanoid(),
  type: "mcq" as QuestionType,
  questionCount: 5,
  marksPerQuestion: 1,
});

function defaultDueDate(): string {
  // Store as YYYY-MM-DD (ISO date) so Mongoose can parse it and formatDate() works
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

const initial: AssignmentDraft = {
  step: 0,
  title: "",
  subject: "",
  className: "",
  schoolName: "Delhi Public School",
  dueDate: defaultDueDate(),
  timeAllowed: 60,
  instructions: "",
  uploadedFiles: [],
  sections: [defaultSection()],
  additionalInstructions: "",
  syllabusText: "",
};

export const useAssignmentDraftStore = create<AssignmentDraftStore>((set, get) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setField: (key, value) => set({ [key]: value } as Partial<AssignmentDraft>),
  addSection: () =>
    set((s) => ({ sections: [...s.sections, defaultSection()] })),
  updateSection: (id, patch) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.id === id ? { ...sec, ...patch } : sec
      ),
    })),
  removeSection: (id) =>
    set((s) => ({ sections: s.sections.filter((sec) => sec.id !== id) })),
  reset: () => set({ ...initial, dueDate: defaultDueDate(), sections: [defaultSection()] }),
  totalQuestions: () =>
    get().sections.reduce((sum, s) => sum + s.questionCount, 0),
  totalMarks: () =>
    get().sections.reduce(
      (sum, s) => sum + s.questionCount * s.marksPerQuestion,
      0
    ),
}));
