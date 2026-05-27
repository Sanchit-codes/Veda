import { create } from "zustand";
import type { Assignment, AssignmentListItem } from "@/types/assignment";

interface AssignmentStore {
  assignments: AssignmentListItem[];
  current: Assignment | null;
  setAssignments: (a: AssignmentListItem[]) => void;
  setCurrent: (a: Assignment | null) => void;
  updateQuestion: (
    sectionId: string,
    questionId: string,
    patch: Partial<import("@/types/assignment").Question>
  ) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  current: null,
  setAssignments: (assignments) => set({ assignments }),
  setCurrent: (current) => set({ current }),
  updateQuestion: (sectionId, questionId, patch) =>
    set((state) => {
      if (!state.current) return state;
      return {
        current: {
          ...state.current,
          sections: state.current.sections.map((s) =>
            s._id === sectionId
              ? {
                  ...s,
                  questions: s.questions.map((q) =>
                    q._id === questionId ? { ...q, ...patch } : q
                  ),
                }
              : s
          ),
        },
      };
    }),
}));
