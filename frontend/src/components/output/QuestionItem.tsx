"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { Question } from "@/types/assignment";
import { DifficultyBadge, BloomsBadge } from "@/components/ui/Badge";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import { assignmentsApi } from "@/lib/api";
import QuestionEditModal from "./QuestionEditModal";

interface QuestionItemProps {
  question: Question;
  number: number;
  showAnswer: boolean;
  sectionId: string;
}

export default function QuestionItem({
  question,
  number,
  showAnswer,
  sectionId,
}: QuestionItemProps) {
  const { id: assignmentId } = useParams<{ id: string }>();
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const { updateQuestion } = useAssignmentStore();

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const { data: newQ } = await assignmentsApi.regenerateQuestion(
        assignmentId,
        sectionId,
        question._id
      );
      updateQuestion(sectionId, question._id, newQ as Partial<Question>);
    } catch (err) {
      console.error("[REGEN] Failed to regenerate question:", err);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <>
      <li className={`group relative ${regenerating ? "opacity-60" : ""} transition-opacity`}>
        {regenerating && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-xs font-medium text-[#ff5623] bg-white/80 px-3 py-1 rounded-full" style={{ letterSpacing: "-0.4px" }}>
              Regenerating…
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {/* Question text + actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-base text-[#303030] tracking-[-0.64px] leading-[2.4]">
                {question.text}{" "}
                <span className="text-sm font-semibold">
                  [{question.marks} Mark{question.marks !== 1 ? "s" : ""}]
                </span>
              </span>

              {/* MCQ options */}
              {question.type === "mcq" && question.options && (
                <ol
                  className="pl-4 flex flex-col gap-1"
                  style={{ listStyleType: "lower-alpha" }}
                >
                  {question.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`text-base tracking-[-0.64px] ${
                        showAnswer && opt === question.answer
                          ? "font-bold text-green-700"
                          : "text-[#303030]"
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ol>
              )}

              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <DifficultyBadge level={question.difficulty} />
                <BloomsBadge level={question.bloomsLevel} />
              </div>

              {/* Answer (answer key mode) */}
              {showAnswer && (
                <div className="mt-1 p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-sm font-medium text-green-700 tracking-[-0.56px]">
                    <span className="font-bold">Answer: </span>
                    {question.answer}
                  </p>
                  {question.explanation && (
                    <p className="text-sm text-green-600 tracking-[-0.56px] mt-0.5">
                      <span className="font-semibold">Explanation: </span>
                      {question.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Edit/regenerate actions (hidden until hover) */}
            {!showAnswer && (
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="size-7 flex items-center justify-center rounded-lg bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                  title="Edit question"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14L5.5 13L13 5.5L10.5 3L3 10.5L2 14Z" stroke="#5e5e5e" strokeWidth="1.25" strokeLinejoin="round"/>
                    <path d="M10.5 3L13 5.5" stroke="#5e5e5e" strokeWidth="1.25"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className={`size-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    regenerating
                      ? "bg-[#ff5623]/10 cursor-wait"
                      : "bg-[#f0f0f0] hover:bg-[#ff5623]/10"
                  }`}
                  title="Regenerate question"
                >
                  <svg
                    width="14" height="14" viewBox="0 0 16 16" fill="none"
                    className={regenerating ? "animate-spin" : ""}
                  >
                    <path d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.38071 3 10.6307 3.55964 11.5355 4.46447" stroke={regenerating ? "#ff5623" : "#5e5e5e"} strokeWidth="1.25" strokeLinecap="round"/>
                    <path d="M11.5 2V5H8.5" stroke={regenerating ? "#ff5623" : "#5e5e5e"} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </li>

      {editing && (
        <QuestionEditModal
          question={question}
          sectionId={sectionId}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
