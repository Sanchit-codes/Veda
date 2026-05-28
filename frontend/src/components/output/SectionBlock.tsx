"use client";

import type { GeneratedSection } from "@/types/assignment";
import QuestionItem from "./QuestionItem";

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice Questions",
  short: "Short Answer Questions",
  long: "Long Answer Questions",
  truefalse: "True / False Questions",
};

interface SectionBlockProps {
  section: GeneratedSection;
  label: string;
  showAnswers: boolean;
  startNumber: number;
}

export default function SectionBlock({
  section,
  label,
  showAnswers,
  startNumber,
}: SectionBlockProps) {
  const totalMarks = section.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#303030] tracking-[-0.96px] leading-[1.6]">
          Section {label}
        </h2>
      </div>

      {/* Section meta */}
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-semibold text-[#303030] tracking-[-0.72px]">
          {TYPE_LABELS[section.type] ?? section.type}
        </p>
        {section.instructions && (
          <p className="text-base italic text-[#5e5e5e] tracking-[-0.64px]">
            {section.instructions}
          </p>
        )}
        <p className="text-base italic text-[#5e5e5e] tracking-[-0.64px]">
          {section.questions.length} questions · {totalMarks} marks
        </p>
      </div>

      {/* Questions */}
      <ol className="flex flex-col gap-4 list-decimal pl-6">
        {section.questions.map((question, idx) => (
          <QuestionItem
            key={question._id}
            question={question}
            number={startNumber + idx}
            showAnswer={showAnswers}
            sectionId={section._id}
          />
        ))}
      </ol>
    </div>
  );
}
