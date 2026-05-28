"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { useAssignmentData } from "@/lib/hooks/useAssignmentData";
import ExamPaper from "@/components/output/ExamPaper";
import GeneratingView from "@/components/generation/GeneratingView";

export default function OutputContent() {
  const { id } = useParams<{ id: string }>();
  const assignment = useAssignmentData(id);          // fetches from backend
  const { status, sections: streamSections, assignmentId: generatingId } = useGenerationStore();

  // Only show the live generating view if generation is still in progress
  // AND the store is tracking THIS specific assignment (not a leftover from a previous one).
  const isGenerating =
    generatingId === id &&
    (status === "queued" || status === "started" || status === "generating");

  if (isGenerating) {
    return <GeneratingView />;
  }

  const sections = assignment?.sections.length ? assignment.sections : streamSections;

  return (
    /*
     * Outer wrapper: bg-[#5e5e5e] rounded-[32px] p-5 — matches Figma exactly.
     * This is the dark gray container that holds the AI banner + paper card.
     */
    <div
      className="mx-5 mt-0 mb-10 rounded-[32px] flex flex-col gap-3 p-5"
      style={{ background: "#5e5e5e" }}
    >
      {/* AI response banner */}
      <div
        className="rounded-[32px] px-8 py-6 flex flex-col gap-4"
        style={{ background: "rgba(24,24,24,0.8)" }}
      >
        <p
          className="text-xl font-bold text-white leading-[1.4]"
          style={{ letterSpacing: "-0.8px" }}
        >
          {assignment
            ? `Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade ${assignment.className} ${assignment.subject} classes on the NCERT chapters:`
            : "Your question paper has been generated successfully."}
        </p>
        <div className="flex items-center gap-3">
          {/* Download as PDF — opens print page in new tab */}
          <button
            type="button"
            onClick={() => window.open(`/assignments/${id}/print`, "_blank")}
            className="flex items-center gap-1.5 bg-white rounded-full px-6 h-11 text-base font-medium text-[#303030] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            style={{ letterSpacing: "-0.64px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9H4V19H20V9H18M12 3V15M8 11L12 15L16 11" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download as PDF
          </button>
          {/* Answer key link */}
          <Link
            href={`/assignments/${id}/answer-key`}
            className="flex items-center gap-1.5 rounded-full px-6 h-11 text-base font-medium text-white hover:bg-white/10 transition-colors border border-white/20"
            style={{ letterSpacing: "-0.64px" }}
          >
            View Answer Key
          </Link>
        </div>
      </div>

      {/* Exam paper card — white, rounded-[32px] */}
      {assignment && sections.length > 0 ? (
        <ExamPaper assignment={assignment} sections={sections} />
      ) : (
        <div className="bg-white rounded-[32px] p-16 flex items-center justify-center">
          <p className="text-base text-[#a9a9a9]" style={{ letterSpacing: "-0.64px" }}>
            No content generated yet.
          </p>
        </div>
      )}
    </div>
  );
}
