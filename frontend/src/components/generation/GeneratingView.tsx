"use client";

import { useGenerationStore } from "@/stores/useGenerationStore";

export default function GeneratingView() {
  const { status, streamBuffer, sections } = useGenerationStore();

  return (
    <div className="flex flex-col gap-4 px-5">
      {/* Status bar */}
      <div className="bg-white/50 rounded-2xl px-6 py-4 flex items-center gap-3">
        <div className="size-2.5 rounded-full bg-[#ff5623] animate-pulse" />
        <p className="text-base font-medium text-[#303030] tracking-[-0.64px]">
          {status === "queued" && "Queued — preparing your paper…"}
          {status === "started" && "Starting generation…"}
          {status === "generating" && `Generating section ${sections.length + 1}…`}
        </p>
      </div>

      {/* Completed sections */}
      {sections.map((sec, idx) => (
        <div key={sec._id} className="bg-white rounded-2xl px-6 py-4 flex items-center gap-3">
          <div className="size-2.5 rounded-full bg-green-500 shrink-0" />
          <p className="text-base font-medium text-[#303030] tracking-[-0.64px]">
            Section {String.fromCharCode(65 + idx)} — {sec.questions.length} questions ready
          </p>
        </div>
      ))}

      {/* Current streaming */}
      {streamBuffer && (
        <div
          className="rounded-3xl px-8 py-6"
          style={{ background: "rgba(24,24,24,0.8)" }}
        >
          <p className="text-base font-medium text-white/80 tracking-[-0.56px] leading-[1.8] font-[var(--font-inter)] whitespace-pre-wrap">
            {streamBuffer}
            <span className="inline-block size-1.5 rounded-full bg-white ml-1 animate-pulse" />
          </p>
        </div>
      )}

      {/* Placeholder paper skeleton */}
      {!streamBuffer && (
        <div className="bg-white rounded-3xl p-8 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 bg-[#f0f0f0] rounded-lg w-72 animate-pulse" />
            <div className="h-6 bg-[#f0f0f0] rounded-lg w-48 animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-5 bg-[#f0f0f0] rounded-lg animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
