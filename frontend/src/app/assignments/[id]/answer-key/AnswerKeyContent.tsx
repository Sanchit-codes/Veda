"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAssignmentData } from "@/lib/hooks/useAssignmentData";
import ExamPaper from "@/components/output/ExamPaper";

export default function AnswerKeyContent() {
  const { id } = useParams<{ id: string }>();
  const current = useAssignmentData(id);

  if (!current || !current.sections.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-base text-[#a9a9a9] tracking-[-0.64px]">
          No assignment data. <Link href="/dashboard" className="text-[#303030] underline">Go back</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 pb-10">
      {/* Teacher banner */}
      <div
        className="rounded-3xl px-8 py-6 flex flex-col gap-4"
        style={{ background: "rgba(24,24,24,0.8)" }}
      >
        <p className="text-xl font-bold text-white tracking-[-0.8px] leading-[1.4]">
          Answer Key — {current.subject} Class {current.className}
        </p>
        <div className="flex gap-3">
          <Link
            href={`/assignments/${id}/output`}
            className="flex items-center gap-1.5 bg-white/15 border border-white/30 rounded-full px-6 h-11 text-base font-medium text-white tracking-[-0.64px] hover:bg-white/25 transition-colors"
          >
            View Question Paper
          </Link>
          <button
            type="button"
            onClick={() => window.open(`/assignments/${id}/print?answers=1`, "_blank")}
            className="flex items-center gap-1.5 bg-white rounded-full px-6 h-11 text-base font-medium text-[#303030] tracking-[-0.64px] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            Download Answer Key PDF
          </button>
        </div>
      </div>

      {/* Paper with answers shown */}
      <ExamPaper
        assignment={current}
        sections={current.sections}
        showAnswers
      />
    </div>
  );
}
