"use client";

import { useRouter } from "next/navigation";
import { useAssignmentDraftStore } from "@/stores/useAssignmentDraftStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function StepTwo() {
  const router = useRouter();
  const { title, subject, className, schoolName, timeAllowed, setField, setStep } =
    useAssignmentDraftStore();

  const isValid = title.trim() && subject.trim() && className.trim();

  const handleGenerate = () => {
    // Navigate to generating screen — API wiring in integration phase
    router.push("/assignments/new/generating");
  };

  return (
    <div className="w-full max-w-[810px] flex flex-col gap-8">

      {/* Card — semi-transparent matching Figma rgba(255,255,255,0.5) */}
      <div className="rounded-[32px] p-8 flex flex-col gap-6" style={{ background: "rgba(255,255,255,0.5)" }}>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold text-[#303030]" style={{ letterSpacing: "-0.8px" }}>
            Assignment Details
          </h2>
          <p className="text-sm text-[rgba(94,94,94,0.8)]" style={{ letterSpacing: "-0.56px" }}>
            Basic information about your assignment
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Assignment Title"
              value={title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Chapter 5 – Chemical Effects"
            />
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setField("subject", e.target.value)}
              placeholder="e.g. Science"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class"
              value={className}
              onChange={(e) => setField("className", e.target.value)}
              placeholder="e.g. 8th"
            />
            <Input
              label="School Name"
              value={schoolName}
              onChange={(e) => setField("schoolName", e.target.value)}
              placeholder="e.g. Delhi Public School"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Time Allowed (minutes)"
              type="number"
              min={10}
              max={360}
              value={timeAllowed}
              onChange={(e) => setField("timeAllowed", Number(e.target.value))}
              placeholder="60"
            />
          </div>
        </div>
      </div>

      {/* Navigation — Previous | Generate Paper */}
      <div className="flex items-center justify-between">
        <Button
          variant="white"
          onClick={() => setStep(0)}
          iconLeft={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M9 6L5 10L9 14" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          Previous
        </Button>
        <Button
          variant="dark"
          disabled={!isValid}
          onClick={handleGenerate}
          iconRight={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10H15M11 6L15 10L11 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          Generate Paper
        </Button>
      </div>
    </div>
  );
}
