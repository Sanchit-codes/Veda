import { create } from "zustand";
import type { JobStatus } from "@/types/generation";
import type { GeneratedSection, Question } from "@/types/assignment";

export interface SourceAnalysis {
  docCount: number;
  totalChars: number;
  preview: string;
  hasContent: boolean;
}

interface GenerationStore {
  jobId: string | null;
  assignmentId: string | null;
  status: JobStatus;
  sections: GeneratedSection[];
  streamBuffer: string;
  progress: number;
  pdfUrl: string | null;
  error: string | null;
  thinkingSteps: string[];
  sourceAnalysis: SourceAnalysis | null;

  startGeneration: (assignmentId: string) => void;
  setJob: (jobId: string, assignmentId: string) => void;
  setStatus: (status: JobStatus) => void;
  appendStream: (token: string) => void;
  clearStream: () => void;
  addSection: (section: GeneratedSection) => void;
  replaceQuestion: (sectionId: string, question: Question) => void;
  setPdfUrl: (url: string) => void;
  setError: (error: string) => void;
  addThinkingStep: (step: string) => void;
  setSourceAnalysis: (analysis: SourceAnalysis) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  jobId: null,
  assignmentId: null,
  status: "idle",
  sections: [],
  streamBuffer: "",
  progress: 0,
  pdfUrl: null,
  error: null,
  thinkingSteps: [],
  sourceAnalysis: null,

  startGeneration: (assignmentId) => set({ assignmentId, status: "queued", sections: [], streamBuffer: "", error: null, thinkingSteps: [], sourceAnalysis: null }),
  setJob: (jobId, assignmentId) => set({ jobId, assignmentId, status: "queued" }),
  setStatus: (status) => set({ status }),
  appendStream: (token) =>
    set((s) => ({ streamBuffer: s.streamBuffer + token })),
  clearStream: () => set({ streamBuffer: "" }),
  addSection: (section) =>
    set((s) => ({ sections: [...s.sections, section], streamBuffer: "" })),
  replaceQuestion: (sectionId, question) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec._id === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q._id === question._id ? question : q
              ),
            }
          : sec
      ),
    })),
  setPdfUrl: (pdfUrl) => set({ pdfUrl }),
  setError: (error) => set({ error, status: "failed" }),
  addThinkingStep: (step) =>
    set((s) => ({ thinkingSteps: [...s.thinkingSteps, step] })),
  setSourceAnalysis: (sourceAnalysis) => set({ sourceAnalysis }),
  reset: () =>
    set({
      jobId: null,
      assignmentId: null,
      status: "idle",
      sections: [],
      streamBuffer: "",
      progress: 0,
      pdfUrl: null,
      error: null,
      thinkingSteps: [],
      sourceAnalysis: null,
    }),
}));
