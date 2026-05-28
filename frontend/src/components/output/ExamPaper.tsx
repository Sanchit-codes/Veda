"use client";

import type { Assignment, GeneratedSection } from "@/types/assignment";
import SectionBlock from "./SectionBlock";

interface ExamPaperProps {
  assignment: Assignment;
  sections: GeneratedSection[];
  showAnswers?: boolean;
}

const SECTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function ExamPaper({ assignment, sections, showAnswers = false }: ExamPaperProps) {
  const totalMarks = sections.reduce(
    (sum, s) => sum + s.questions.reduce((qs, q) => qs + q.marks, 0),
    0
  );

  return (
    /* Figma: bg-white rounded-[32px] p-[32px] gap-[24px] */
    <div
      className="bg-white rounded-[32px] p-8 flex flex-col gap-6"
      style={{ fontFamily: "var(--font-inter), Inter, serif" }}
    >
      {/* School + Subject + Class */}
      <div className="text-center flex flex-col">
        <span
          className="font-bold text-[#303030] leading-[1.6]"
          style={{ fontSize: 32, letterSpacing: "-0.96px" }}
        >
          {assignment.schoolName}
        </span>
        <span
          className="font-semibold text-[#303030] leading-[1.6]"
          style={{ fontSize: 24, letterSpacing: "-0.96px" }}
        >
          Subject: {assignment.subject}
        </span>
        <span
          className="font-semibold text-[#303030] leading-[1.6]"
          style={{ fontSize: 24, letterSpacing: "-0.96px" }}
        >
          Class: {assignment.className}
        </span>
      </div>

      {/* Time + Marks */}
      <div
        className="flex items-center justify-between font-semibold text-[#303030]"
        style={{ fontSize: 18, letterSpacing: "-0.72px" }}
      >
        <span>Time Allowed: {assignment.timeAllowed ?? 60} minutes</span>
        <span>Maximum Marks: {totalMarks}</span>
      </div>

      {/* General instructions */}
      {assignment.instructions && (
        <p
          className="font-semibold text-[#303030]"
          style={{ fontSize: 18, letterSpacing: "-0.72px" }}
        >
          {assignment.instructions}
        </p>
      )}

      {/* Student info — question paper only */}
      {!showAnswers && (
        <div
          className="flex flex-col gap-0.5 font-semibold text-[#303030]"
          style={{ fontSize: 18, letterSpacing: "-0.72px" }}
        >
          <p>Name: ______________________</p>
          <p>Roll Number: ________________</p>
          <p>Class: {assignment.className} &nbsp; Section: __________</p>
        </div>
      )}

      <hr className="border-[#dadada]" />

      {/* Sections */}
      {sections.map((section, idx) => (
        <SectionBlock
          key={section._id}
          section={section}
          label={SECTION_LABELS[idx] ?? String(idx + 1)}
          showAnswers={showAnswers}
          startNumber={sections.slice(0, idx).reduce((s, sec) => s + sec.questions.length, 1)}
        />
      ))}
    </div>
  );
}
