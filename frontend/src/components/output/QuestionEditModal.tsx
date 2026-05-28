"use client";

import { useState } from "react";
import type { Question } from "@/types/assignment";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface QuestionEditModalProps {
  question: Question;
  sectionId: string;
  onClose: () => void;
}

export default function QuestionEditModal({
  question,
  sectionId,
  onClose,
}: QuestionEditModalProps) {
  const [text, setText] = useState(question.text);
  const [marks, setMarks] = useState(question.marks);
  const [answer, setAnswer] = useState(question.answer);
  const { updateQuestion } = useAssignmentStore();

  const handleSave = () => {
    updateQuestion(sectionId, question._id, { text, marks, answer });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#303030] tracking-[-0.72px]">
            Edit Question
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="#303030" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <Textarea
          label="Question Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Marks"
            type="number"
            min={1}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>

        <Textarea
          label="Answer / Model Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
        />

        <div className="flex gap-3 justify-end">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
