import axios from "axios";
import type { Assignment, AssignmentListItem, SectionConfig } from "@/types/assignment";

// Use the Next.js rewrite proxy (/api → backend) in browser to avoid mixed content.
// NEXT_PUBLIC_API_URL is only used server-side or local dev without the proxy.
const baseURL =
  typeof window !== "undefined"
    ? "/api"
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default api;

// ── Assignments ──────────────────────────────────────────────────────────────

export interface CreateAssignmentPayload {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate?: string;
  timeAllowed?: number;
  instructions?: string;
  additionalInstructions?: string;
  syllabusText?: string;
  sectionConfigs: SectionConfig[];
}

export const assignmentsApi = {
  list: () => api.get<AssignmentListItem[]>("/assignments"),

  get: (id: string) => api.get<Assignment>(`/assignments/${id}`),

  create: (payload: CreateAssignmentPayload) =>
    api.post<Assignment>("/assignments", payload),

  update: (id: string, payload: Partial<CreateAssignmentPayload>) =>
    api.patch<Assignment>(`/assignments/${id}`, payload),

  delete: (id: string) => api.delete(`/assignments/${id}`),

  uploadFiles: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    return api.post(`/assignments/${id}/files`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  generate: (id: string) =>
    api.post<{ jobId: string }>(`/assignments/${id}/generate`),

  generationStatus: (id: string) =>
    api.get(`/assignments/${id}/generate/status`),

  updateQuestion: (
    assignmentId: string,
    sectionId: string,
    questionId: string,
    patch: Record<string, unknown>
  ) =>
    api.patch(
      `/assignments/${assignmentId}/sections/${sectionId}/questions/${questionId}`,
      patch
    ),

  regenerateQuestion: (
    assignmentId: string,
    sectionId: string,
    questionId: string
  ) =>
    api.post(
      `/assignments/${assignmentId}/generate/sections/${sectionId}/questions/${questionId}/regenerate`
    ),
};
