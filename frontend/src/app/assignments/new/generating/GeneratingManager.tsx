"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentDraftStore } from "@/stores/useAssignmentDraftStore";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { assignmentsApi } from "@/lib/api";
import { subscribeToAssignment } from "@/lib/socket";
import StreamingPaper from "./StreamingPaper";

type Phase = "creating" | "uploading" | "queuing" | "generating" | "completed" | "failed";

export default function GeneratingManager() {
  const router = useRouter();
  const started = useRef(false);
  const navigated = useRef(false);

  // Keep assignmentId in a ref so navigation never depends on async store state
  const assignmentIdRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<Phase>("creating");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guard: redirect if accessed directly without a valid draft
  useEffect(() => {
    const draft = useAssignmentDraftStore.getState();
    const hasDraft = draft.title?.trim() && draft.sections?.length > 0;
    if (!hasDraft) {
      router.replace("/assignments/new");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to generation store — reactive
  const status = useGenerationStore((s) => s.status);
  const sections = useGenerationStore((s) => s.sections);
  const storeAssignmentId = useGenerationStore((s) => s.assignmentId);

  // Capture total sections once at mount so reset() doesn't change it mid-flight
  // Use getState() so we always read the user's actual section count, not a stale render snapshot
  const totalSectionsRef = useRef(useAssignmentDraftStore.getState().sections.length || 1);
  const totalSections = totalSectionsRef.current;

  // ── Navigate helper (idempotent) ─────────────────────────────────────────
  function navigateToOutput(id: string) {
    if (navigated.current) return;
    navigated.current = true;
    console.log("[GEN] Navigating to output for assignment", id);
    // Mark completed so the output page never sees a stale "generating" status
    useGenerationStore.getState().setStatus("completed");
    useAssignmentDraftStore.getState().reset();
    router.push(`/assignments/${id}/output`);
  }

  // ── API + WebSocket setup ────────────────────────────────────────────────
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let unsubSocket: (() => void) | null = null;

    const addStep = (step: string) =>
      useGenerationStore.getState().addThinkingStep(step);

    const run = async () => {
      try {
        // 1. Create assignment
        // Read state at call time via getState() to avoid stale closure issues
        // in React 19 concurrent rendering (hook snapshot can be from an earlier render)
        const currentDraft = useAssignmentDraftStore.getState();
        setPhase("creating");
        addStep("Setting up your assignment…");
        const { data: assignment } = await assignmentsApi.create({
          title: currentDraft.title || "Untitled Assignment",
          subject: currentDraft.subject || "General",
          className: currentDraft.className || "—",
          schoolName: currentDraft.schoolName,
          dueDate: currentDraft.dueDate || undefined,
          timeAllowed: currentDraft.timeAllowed,
          additionalInstructions: currentDraft.additionalInstructions,
          syllabusText: currentDraft.syllabusText || undefined,
          sectionConfigs: currentDraft.sections,
        });

        const id = assignment._id;
        assignmentIdRef.current = id;

        useGenerationStore.getState().startGeneration(id);
        // Re-add the step that was just cleared by startGeneration
        addStep("Setting up your assignment…");

        if (currentDraft.syllabusText?.trim()) {
          addStep(`Syllabus context received — ${currentDraft.sections.length} section${currentDraft.sections.length !== 1 ? "s" : ""} to generate`);
        } else {
          addStep(`${currentDraft.sections.length} section${currentDraft.sections.length !== 1 ? "s" : ""} queued for generation`);
        }

        // 2. Upload files
        if (currentDraft.uploadedFiles.length > 0) {
          setPhase("uploading");
          addStep(`Uploading ${currentDraft.uploadedFiles.length} file${currentDraft.uploadedFiles.length !== 1 ? "s" : ""} and extracting text…`);
          await assignmentsApi.uploadFiles(id, currentDraft.uploadedFiles);
          addStep("Source material processed — ready to generate");
        }

        // 3. Subscribe to WebSocket BEFORE triggering — avoid missing events
        unsubSocket = subscribeToAssignment(id);

        // 4. Trigger generation
        setPhase("queuing");
        addStep("Connecting to AI model…");
        await assignmentsApi.generate(id);
        setPhase("generating");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setErrorMsg(msg);
        setPhase("failed");
        useGenerationStore.getState().setError(msg);
      }
    };

    run();

    return () => {
      unsubSocket?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigate when job:completed fires ───────────────────────────────────
  useEffect(() => {
    const id = assignmentIdRef.current ?? storeAssignmentId;
    if (!id) return;
    if (status === "completed") {
      navigateToOutput(id);
    }
  }, [status, storeAssignmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fallback: navigate once all sections have arrived ───────────────────
  // Handles the case where job:completed is missed/delayed
  useEffect(() => {
    const id = assignmentIdRef.current ?? storeAssignmentId;
    if (!id) return;
    if (sections.length > 0 && sections.length >= totalSections) {
      console.log(`[GEN] All ${sections.length}/${totalSections} sections received — navigating`);
      navigateToOutput(id);
    }
  }, [sections.length, totalSections, storeAssignmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error state ──────────────────────────────────────────────────────────
  if (phase === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full flex flex-col gap-4 text-center"
          style={{ boxShadow: "0px 16px 24px rgba(0,0,0,0.08)" }}
        >
          <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#ff4040" strokeWidth="1.5"/>
              <path d="M12 8V12M12 16H12.01" stroke="#ff4040" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#303030]" style={{ letterSpacing: "-0.72px" }}>
            Generation failed
          </h2>
          <p className="text-sm text-[#5e5e5e]">{errorMsg}</p>
          <button
            onClick={() => router.push("/assignments/new")}
            className="px-6 py-3 rounded-full bg-[#181818] text-white text-base font-medium hover:bg-[#2b2b2b] transition-colors cursor-pointer"
          >
            Go back and try again
          </button>
        </div>
      </div>
    );
  }

  return <StreamingPaper phase={phase} />;
}
