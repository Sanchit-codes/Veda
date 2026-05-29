"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentDraftStore } from "@/stores/useAssignmentDraftStore";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { assignmentsApi } from "@/lib/api";
import StreamingPaper from "./StreamingPaper";

type Phase = "creating" | "uploading" | "queuing" | "generating" | "completed" | "failed";

const POLL_INTERVAL_MS = 3000;

export default function GeneratingManager() {
  const router = useRouter();
  const started = useRef(false);
  const navigated = useRef(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // ── Navigate helper (idempotent) ─────────────────────────────────────────
  function navigateToOutput(id: string) {
    if (navigated.current) return;
    navigated.current = true;
    if (pollTimer.current) clearInterval(pollTimer.current);
    sessionStorage.removeItem("veda_gen_lock");
    useGenerationStore.getState().setStatus("completed");
    useAssignmentDraftStore.getState().reset();
    router.push(`/assignments/${id}/output`);
  }

  // ── Poll job status via HTTP ──────────────────────────────────────────────
  function startPolling(assignmentId: string) {
    const addStep = (step: string) =>
      useGenerationStore.getState().addThinkingStep(step);

    pollTimer.current = setInterval(async () => {
      try {
        const { data: job } = await assignmentsApi.generationStatus(assignmentId);
        console.log("[POLL] job status:", job.status, "progress:", job.progress);

        if (job.status === "started" || job.status === "generating") {
          setPhase("generating");
          useGenerationStore.getState().setStatus("generating");
          if (job.currentSectionIndex > 0) {
            addStep(`Generating section ${job.currentSectionIndex} of ${job.totalSections}…`);
          }
        }

        if (job.status === "completed") {
          addStep("All sections generated!");
          navigateToOutput(assignmentId);
        }

        if (job.status === "failed") {
          if (pollTimer.current) clearInterval(pollTimer.current);
          const msg = job.error || "Generation failed";
          setErrorMsg(msg);
          setPhase("failed");
          useGenerationStore.getState().setError(msg);
        }
      } catch (err) {
        console.warn("[POLL] Status check failed:", err);
      }
    }, POLL_INTERVAL_MS);
  }

  // ── Main flow ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (started.current) return;
    // sessionStorage lock prevents double-creation if the component remounts
    if (sessionStorage.getItem("veda_gen_lock") === "1") return;
    started.current = true;
    sessionStorage.setItem("veda_gen_lock", "1");

    const addStep = (step: string) =>
      useGenerationStore.getState().addThinkingStep(step);

    const run = async () => {
      try {
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
        addStep("Setting up your assignment…");

        if (currentDraft.syllabusText?.trim()) {
          addStep(`Syllabus context received — ${currentDraft.sections.length} section${currentDraft.sections.length !== 1 ? "s" : ""} to generate`);
        } else {
          addStep(`${currentDraft.sections.length} section${currentDraft.sections.length !== 1 ? "s" : ""} queued for generation`);
        }

        // Upload files if any
        if (currentDraft.uploadedFiles.length > 0) {
          setPhase("uploading");
          addStep(`Uploading ${currentDraft.uploadedFiles.length} file${currentDraft.uploadedFiles.length !== 1 ? "s" : ""} and extracting text…`);
          await assignmentsApi.uploadFiles(id, currentDraft.uploadedFiles);
          addStep("Source material processed — ready to generate");
        }

        // Trigger generation
        setPhase("queuing");
        addStep("Connecting to AI model…");
        await assignmentsApi.generate(id);
        setPhase("generating");
        addStep("AI is generating your questions…");

        // Start polling instead of WebSocket
        startPolling(id);
      } catch (err: unknown) {
        sessionStorage.removeItem("veda_gen_lock");
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setErrorMsg(msg);
        setPhase("failed");
        useGenerationStore.getState().setError(msg);
      }
    };

    run();

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
