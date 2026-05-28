"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAssignmentData } from "@/lib/hooks/useAssignmentData";
import type { GeneratedSection, Question } from "@/types/assignment";

// ── Compact print-only exam paper ────────────────────────────────────────────

function PrintQuestionPaper({
  assignment,
  sections,
}: {
  assignment: ReturnType<typeof useAssignmentData>;
  sections: GeneratedSection[];
}) {
  if (!assignment) return null;
  const totalMarks = sections.reduce(
    (s, sec) => s + sec.questions.reduce((qs, q) => qs + q.marks, 0),
    0
  );

  return (
    <div className="print-paper">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-[18pt] font-bold">{assignment.schoolName}</div>
        <div className="text-[13pt] font-semibold mt-0.5">
          {assignment.subject} &mdash; Class {assignment.className}
        </div>
        <div className="text-[10pt] mt-1 flex justify-center gap-8">
          <span>Time: {assignment.timeAllowed ?? 60} min</span>
          <span>Max Marks: {totalMarks}</span>
          {assignment.dueDate && (
            <span>Date: {new Date(assignment.dueDate).toLocaleDateString("en-IN")}</span>
          )}
        </div>
      </div>

      <div className="border-t border-b border-black py-1 mb-3 flex gap-10 text-[9pt]">
        <span>Name: _______________________________</span>
        <span>Roll No: ____________</span>
        <span>Section: ____________</span>
      </div>

      {/* Sections */}
      {sections.map((sec, si) => {
        const label = String.fromCharCode(65 + si);
        const TYPE_LABELS: Record<string, string> = {
          mcq: "Multiple Choice Questions",
          short: "Short Answer Questions",
          long: "Long Answer Questions",
          truefalse: "True / False Questions",
        };
        const secMarks = sec.questions.reduce((s, q) => s + q.marks, 0);
        let qNum = sections.slice(0, si).reduce((s, s2) => s + s2.questions.length, 1);

        return (
          <div key={sec._id} className="mb-3">
            <div className="font-bold text-[11pt] mb-0.5">
              Section {label} &mdash; {TYPE_LABELS[sec.type] ?? sec.type}
              <span className="font-normal text-[9pt] ml-2">
                ({sec.questions.length} questions &times; {sec.questions[0]?.marks ?? 1} marks = {secMarks} marks)
              </span>
            </div>
            {sec.instructions && (
              <div className="italic text-[9pt] mb-1 text-gray-600">{sec.instructions}</div>
            )}
            <ol className="list-none pl-0 flex flex-col gap-1.5">
              {sec.questions.map((q) => {
                const num = qNum++;
                return (
                  <li key={q._id} className="text-[10pt] leading-snug">
                    <span className="font-semibold">{num}.</span>{" "}
                    {q.text}
                    {q.marks > 1 && (
                      <span className="text-[8.5pt] text-gray-500 ml-1">[{q.marks}M]</span>
                    )}
                    {/* MCQ options */}
                    {q.type === "mcq" && q.options && (
                      <div className="grid grid-cols-2 gap-x-4 mt-0.5 pl-4 text-[9.5pt]">
                        {q.options.map((opt, i) => (
                          <span key={i}>
                            ({String.fromCharCode(97 + i)}) {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* True/False options inline */}
                    {q.type === "truefalse" && (
                      <span className="pl-3 text-[9.5pt] text-gray-500">(True / False)</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function PrintAnswerKey({
  assignment,
  sections,
}: {
  assignment: ReturnType<typeof useAssignmentData>;
  sections: GeneratedSection[];
}) {
  if (!assignment) return null;

  return (
    <div className="print-paper">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-[16pt] font-bold">ANSWER KEY</div>
        <div className="text-[12pt] font-semibold">
          {assignment.subject} &mdash; Class {assignment.className}
        </div>
        <div className="text-[9pt] text-gray-500 mt-0.5">{assignment.schoolName}</div>
      </div>

      <div className="border-t border-black mb-3" />

      {/* One compact table per section */}
      {sections.map((sec, si) => {
        const label = String.fromCharCode(65 + si);
        let qNum = sections.slice(0, si).reduce((s, s2) => s + s2.questions.length, 1);

        return (
          <div key={sec._id} className="mb-4">
            <div className="font-bold text-[10pt] mb-1">Section {label}</div>
            <table className="w-full text-[9.5pt] border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-0.5 pr-3 font-semibold w-10">Q.No</th>
                  <th className="text-left py-0.5 font-semibold">Answer</th>
                  <th className="text-right py-0.5 font-semibold w-12">Marks</th>
                </tr>
              </thead>
              <tbody>
                {sec.questions.map((q) => {
                  const num = qNum++;
                  return (
                    <tr key={q._id} className="border-b border-gray-100">
                      <td className="py-0.5 pr-3">{num}.</td>
                      <td className="py-0.5">{q.answer}</td>
                      <td className="py-0.5 text-right">{q.marks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Total */}
      <div className="border-t border-black pt-1 text-right text-[10pt] font-bold">
        Total:{" "}
        {sections.reduce((s, sec) => s + sec.questions.reduce((qs, q) => qs + q.marks, 0), 0)} marks
      </div>
    </div>
  );
}

// ── Main print page component ─────────────────────────────────────────────────

export default function PrintContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const showAnswers = searchParams.get("answers") === "1";
  const assignment = useAssignmentData(id);
  const printed = useRef(false);

  useEffect(() => {
    if (!assignment || !assignment.sections.length || printed.current) return;
    printed.current = true;
    const t = setTimeout(() => window.print(), 700);
    return () => clearTimeout(t);
  }, [assignment]);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-base">Loading…</p>
      </div>
    );
  }

  return (
    <>
      {/* Screen toolbar — hidden when printing */}
      <div className="print:hidden flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-sm text-gray-500">
          {showAnswers ? "Answer Key" : "Question Paper"} — {assignment.title}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.close()}
            className="px-4 h-9 rounded-full border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 h-9 rounded-full bg-[#181818] text-sm font-semibold text-white hover:bg-[#2b2b2b] transition-colors cursor-pointer"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Paper preview on screen */}
      <div className="print:hidden bg-gray-200 min-h-screen py-8 px-4 flex justify-center">
        <div className="bg-white shadow-xl w-[210mm] min-h-[297mm] p-[18mm]">
          {showAnswers ? (
            <PrintAnswerKey assignment={assignment} sections={assignment.sections} />
          ) : (
            <PrintQuestionPaper assignment={assignment} sections={assignment.sections} />
          )}
        </div>
      </div>

      {/* Print-only output — fills @page exactly */}
      <div className="hidden print:block">
        {showAnswers ? (
          <PrintAnswerKey assignment={assignment} sections={assignment.sections} />
        ) : (
          <PrintQuestionPaper assignment={assignment} sections={assignment.sections} />
        )}
      </div>

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; font-family: 'Times New Roman', Times, serif; }
          @page {
            size: A4 portrait;
            margin: 15mm 18mm 15mm 18mm;
          }
        }
        .print-paper {
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          line-height: 1.35;
        }
      `}</style>
    </>
  );
}
