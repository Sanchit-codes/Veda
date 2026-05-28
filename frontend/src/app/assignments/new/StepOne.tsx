"use client";

import { useRouter } from "next/navigation";
import { useAssignmentDraftStore } from "@/stores/useAssignmentDraftStore";
import Stepper from "@/components/ui/Stepper";
import DropZone from "@/components/ui/DropZone";
import FileList from "./FileList";
import Button from "@/components/ui/Button";
import type { QuestionType } from "@/types/assignment";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short", label: "Short Questions" },
  { value: "long", label: "Long Answer Questions" },
  { value: "truefalse", label: "True / False Questions" },
];

export default function StepOne() {
  const {
    dueDate,
    uploadedFiles,
    sections,
    additionalInstructions,
    syllabusText,
    setField,
    setStep,
    addSection,
    updateSection,
    removeSection,
    totalQuestions,
    totalMarks,
  } = useAssignmentDraftStore();

  return (
    <div className="w-full max-w-[810px] flex flex-col gap-8">

      {/* ─── Card — semi-transparent so white pill elements stand out ─── */}
      <div className="rounded-[32px] p-8 flex flex-col gap-6" style={{ background: "rgba(255,255,255,0.5)" }}>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold text-[#303030]" style={{ letterSpacing: "-0.8px" }}>
            Assignment Details
          </h2>
          <p className="text-sm text-[rgba(94,94,94,0.8)]" style={{ letterSpacing: "-0.56px" }}>
            Basic information about your assignment
          </p>
        </div>

        {/* Upload dropzone */}
        <div className="flex flex-col gap-3">
          <DropZone
            onFiles={(files) => setField("uploadedFiles", [...uploadedFiles, ...files])}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p
            className="text-base font-medium text-center"
            style={{ color: "rgba(48,48,48,0.6)", letterSpacing: "-0.64px" }}
          >
            Upload images of your preferred document/image
          </p>
          {uploadedFiles.length > 0 && (
            <FileList
              files={uploadedFiles}
              onRemove={(i) =>
                setField("uploadedFiles", uploadedFiles.filter((_, idx) => idx !== i))
              }
            />
          )}
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-[#303030]" style={{ letterSpacing: "-0.64px" }}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
            className="w-full h-11 px-4 rounded-full bg-transparent text-base font-medium text-[#303030] outline-none transition-colors cursor-pointer"
            style={{ border: "1.25px solid #dadada", letterSpacing: "-0.64px" }}
          />
        </div>

        {/* ─── Question type table ─── */}
        <div className="flex flex-col gap-3">

          {/* Header row — aligns with data rows below */}
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <span
                className="text-base font-bold text-[#303030]"
                style={{ letterSpacing: "-0.64px" }}
              >
                Question Type
              </span>
            </div>
            {/* Spacer for × button column */}
            <div className="w-4 shrink-0" />
            <div className="w-[100px] shrink-0 text-center text-sm font-medium text-[#303030]" style={{ letterSpacing: "-0.56px" }}>
              No. of Questions
            </div>
            <div className="w-[100px] shrink-0 text-center text-sm font-medium text-[#303030]" style={{ letterSpacing: "-0.56px" }}>
              Marks
            </div>
          </div>

          {/* Data rows — one per section, all elements in the same row */}
          {sections.map((sec) => (
            <div key={sec.id} className="flex items-center gap-3">
              {/* Dropdown — fills remaining space */}
              <div className="flex-1 min-w-0 relative">
                <select
                  value={sec.type}
                  onChange={(e) =>
                    updateSection(sec.id, { type: e.target.value as QuestionType })
                  }
                  className="w-full h-11 pl-4 pr-10 rounded-full bg-white border-0 text-base font-medium text-[#303030] appearance-none outline-none cursor-pointer"
                  style={{ letterSpacing: "-0.64px" }}
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                >
                  <path d="M4 6L8 10L12 6" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* × remove — always present */}
              <button
                type="button"
                onClick={() => removeSection(sec.id)}
                className="w-4 shrink-0 flex items-center justify-center text-[#a9a9a9] hover:text-[#ff5623] transition-colors cursor-pointer"
                aria-label="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Count stepper */}
              <div className="w-[100px] shrink-0">
                <Stepper
                  value={sec.questionCount}
                  min={1}
                  max={50}
                  onChange={(v) => updateSection(sec.id, { questionCount: v })}
                />
              </div>

              {/* Marks stepper */}
              <div className="w-[100px] shrink-0">
                <Stepper
                  value={sec.marksPerQuestion}
                  min={1}
                  max={20}
                  onChange={(v) => updateSection(sec.id, { marksPerQuestion: v })}
                />
              </div>
            </div>
          ))}

          {/* Add question type */}
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 text-sm font-bold text-[#303030] hover:text-[#ff5623] transition-colors cursor-pointer w-fit mt-1"
            style={{ letterSpacing: "-0.56px" }}
          >
            <span className="size-9 rounded-full bg-[#2b2b2b] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3V15M3 9H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            Add Question Type
          </button>

          {/* Totals — right aligned */}
          <div
            className="flex flex-col items-end gap-1 text-base font-medium text-[#303030] mt-1"
            style={{ letterSpacing: "-0.64px" }}
          >
            <span>{`Total Questions :  ${totalQuestions()}`}</span>
            <span>{`Total Marks :  ${totalMarks()}`}</span>
          </div>
        </div>

        {/* Syllabus / Topics */}
        <div className="flex flex-col gap-2">
          <label
            className="text-base font-bold text-[#303030]"
            style={{ letterSpacing: "-0.64px" }}
          >
            Syllabus / Topics
          </label>
          <p className="text-sm text-[rgba(94,94,94,0.8)]" style={{ letterSpacing: "-0.56px" }}>
            List the chapters or topics to include in this exam. The AI will focus questions on these.
          </p>
          <textarea
            value={syllabusText}
            onChange={(e) => setField("syllabusText", e.target.value)}
            placeholder="e.g. Chapter 5: Chemical Reactions, Chapter 6: Acids & Bases, Periodic Table basics..."
            rows={4}
            className="w-full p-4 rounded-2xl resize-none text-sm font-medium text-[#303030] placeholder:text-[rgba(48,48,48,0.6)] outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "1.25px dashed #dadada",
              letterSpacing: "-0.56px",
            }}
          />
        </div>

        {/* Additional info */}
        <div className="flex flex-col gap-2">
          <label
            className="text-base font-bold text-[#303030]"
            style={{ letterSpacing: "-0.64px" }}
          >
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea
              value={additionalInstructions}
              onChange={(e) => setField("additionalInstructions", e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              rows={4}
              className="w-full p-4 pb-12 rounded-2xl resize-none text-sm font-medium text-[#303030] placeholder:text-[rgba(48,48,48,0.6)] outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.25)",
                border: "1.25px dashed #dadada",
                letterSpacing: "-0.56px",
              }}
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 size-9 rounded-[18px] bg-[#f0f0f0] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="11" rx="3" stroke="#5e5e5e" strokeWidth="1.5"/>
                <path d="M5 10C5 14.4183 8.13401 18 12 18C15.866 18 19 14.4183 19 10" stroke="#5e5e5e" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 18V22M9 22H15" stroke="#5e5e5e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation — outside card. Step 0 = no Previous button */}
      {/* Validation: need at least one section AND (a file OR syllabus text) */}
      {(() => {
        const hasSource = uploadedFiles.length > 0 || syllabusText.trim().length > 0;
        const canProceed = sections.length > 0 && hasSource;
        return (
          <div className="flex flex-col items-end gap-2">
            {!hasSource && sections.length > 0 && (
              <p className="text-sm text-[#ff5623]" style={{ letterSpacing: "-0.48px" }}>
                Please upload a document or enter syllabus topics before continuing.
              </p>
            )}
            <Button
              variant="dark"
              disabled={!canProceed}
              onClick={() => setStep(1)}
              iconRight={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10H15M11 6L15 10L11 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              Next
            </Button>
          </div>
        );
      })()}
    </div>
  );
}
