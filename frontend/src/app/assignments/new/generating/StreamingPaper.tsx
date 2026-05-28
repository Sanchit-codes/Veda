"use client";

import { useGenerationStore } from "@/stores/useGenerationStore";

type Phase = "creating" | "uploading" | "queuing" | "generating" | "completed" | "failed";

const PHASE_LABELS: Record<Phase, string> = {
  creating: "Creating assignment…",
  uploading: "Uploading source material…",
  queuing: "Queuing generation job…",
  generating: "Generating questions…",
  completed: "Done! Redirecting…",
  failed: "Failed",
};

export default function StreamingPaper({ phase }: { phase: Phase }) {
  const { status, streamBuffer, sections, thinkingSteps, sourceAnalysis } = useGenerationStore();

  const isActive = phase === "generating" || status === "generating" || status === "started";

  return (
    <div className="flex flex-col gap-4 px-5 pb-10">

      {/* Status banner */}
      <div
        className="rounded-2xl px-6 py-4 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.6)" }}
      >
        <div
          className={`size-2.5 rounded-full shrink-0 ${isActive ? "bg-[#ff5623] animate-pulse" : "bg-[#dadada]"}`}
        />
        <p className="text-base font-medium text-[#303030]" style={{ letterSpacing: "-0.64px" }}>
          {PHASE_LABELS[phase]}
        </p>
      </div>

      {/* Source analysis card — shown once source:analyzed arrives */}
      {sourceAnalysis && (
        <div
          className="rounded-2xl px-6 py-5 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M9 16H12M7 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H17M9 4H15M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4M9 4C9 4.55228 9.44772 5 10 5H14C14.5523 5 15 4.55228 15 4" stroke="#5e5e5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-bold text-[#303030]" style={{ letterSpacing: "-0.56px" }}>
              Source Material Analysis
            </span>
            <span className="ml-auto text-xs text-[#a9a9a9]">
              {sourceAnalysis.docCount} file{sourceAnalysis.docCount !== 1 ? "s" : ""}
              {sourceAnalysis.hasContent ? ` · ${(sourceAnalysis.totalChars / 1000).toFixed(1)}k characters` : ""}
            </span>
          </div>
          {sourceAnalysis.hasContent && sourceAnalysis.preview ? (
            <p
              className="text-xs text-[#5e5e5e] leading-[1.7] line-clamp-4"
              style={{ letterSpacing: "-0.32px" }}
            >
              {sourceAnalysis.preview}
              {sourceAnalysis.totalChars > 600 && "…"}
            </p>
          ) : (
            <p className="text-xs text-[#a9a9a9]" style={{ letterSpacing: "-0.32px" }}>
              No readable text extracted — questions will be generated from syllabus and curriculum context.
            </p>
          )}
        </div>
      )}

      {/* Thinking steps timeline */}
      {thinkingSteps.length > 0 && (
        <div
          className="rounded-2xl px-6 py-5 flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          <span className="text-sm font-bold text-[#303030] mb-1" style={{ letterSpacing: "-0.56px" }}>
            What&apos;s happening
          </span>
          {thinkingSteps.map((step, i) => {
            const isLast = i === thinkingSteps.length - 1;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 flex flex-col items-center">
                  <div
                    className={`size-2 rounded-full ${isLast ? "bg-[#ff5623]" : "bg-[#dadada]"} ${isLast && isActive ? "animate-pulse" : ""}`}
                  />
                  {i < thinkingSteps.length - 1 && (
                    <div className="w-px flex-1 bg-[#ebebeb] mt-1" style={{ height: "16px" }} />
                  )}
                </div>
                <p
                  className={`text-sm leading-[1.6] ${isLast ? "text-[#303030] font-medium" : "text-[#a9a9a9]"}`}
                  style={{ letterSpacing: "-0.4px" }}
                >
                  {step}
                </p>
              </div>
            );
          })}
          {isActive && (
            <div className="flex gap-1.5 mt-1 pl-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-1.5 rounded-full bg-[#ff5623] animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed sections */}
      {sections.map((sec, idx) => (
        <div
          key={sec._id}
          className="rounded-2xl px-6 py-4 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.6)" }}
        >
          <div className="size-2.5 rounded-full bg-green-500 shrink-0" />
          <p className="text-base font-medium text-[#303030]" style={{ letterSpacing: "-0.64px" }}>
            Section {String.fromCharCode(65 + idx)} — {sec.questions.length} question{sec.questions.length !== 1 ? "s" : ""} ready
          </p>
        </div>
      ))}

      {/* Live stream output */}
      {streamBuffer ? (
        <div className="rounded-[32px] px-8 py-6" style={{ background: "rgba(24,24,24,0.8)" }}>
          <p
            className="text-base text-white/80 leading-[1.8] whitespace-pre-wrap"
            style={{ fontFamily: "var(--font-inter), Inter, serif", letterSpacing: "-0.32px" }}
          >
            {streamBuffer}
            <span className="inline-block size-1.5 rounded-full bg-white ml-1 animate-pulse align-middle" />
          </p>
        </div>
      ) : (
        /* Skeleton while waiting for first tokens */
        <div className="bg-white rounded-[32px] p-8 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 bg-[#f0f0f0] rounded-lg w-72 animate-pulse" />
            <div className="h-6 bg-[#f0f0f0] rounded-lg w-48 animate-pulse" />
          </div>
          {[90, 75, 85, 60, 80].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-[#f0f0f0] rounded-lg animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
