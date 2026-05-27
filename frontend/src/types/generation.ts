import type { GeneratedSection } from "./assignment";

export type JobStatus =
  | "idle"
  | "queued"
  | "started"
  | "generating"
  | "completed"
  | "failed";

export interface GenerationJob {
  jobId: string;
  assignmentId: string;
  status: JobStatus;
  progress: number;
  currentSectionIndex?: number;
  error?: string;
}

export type StreamEvent =
  | { type: "job:queued"; jobId: string }
  | { type: "job:started"; jobId: string }
  | { type: "section:stream"; sectionIndex: number; token: string }
  | { type: "section:completed"; section: GeneratedSection }
  | { type: "question:regenerated"; sectionId: string; question: import("./assignment").Question }
  | { type: "job:completed" }
  | { type: "job:failed"; error: string }
  | { type: "pdf:ready"; url: string }
  | { type: "thinking:step"; step: string }
  | { type: "source:analyzed"; docCount: number; totalChars: number; preview: string; hasContent: boolean };
