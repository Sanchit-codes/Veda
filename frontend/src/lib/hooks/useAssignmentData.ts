"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import { assignmentsApi } from "@/lib/api";

/**
 * Fetches the assignment by id and sets it as `current` in the store.
 * Safe to call multiple times — skips if the current assignment matches.
 */
export function useAssignmentData(id: string | undefined) {
  const { current, setCurrent } = useAssignmentStore();

  useEffect(() => {
    if (!id) return;
    // Always fetch on mount — ensures we get up-to-date sections after generation
    assignmentsApi
      .get(id)
      .then(({ data }) => setCurrent(data))
      .catch(console.error);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return current?._id === id ? current : null;
}
