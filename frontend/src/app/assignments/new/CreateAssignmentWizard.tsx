"use client";

import { useAssignmentDraftStore } from "@/stores/useAssignmentDraftStore";
import ProgressSteps from "@/components/ui/ProgressSteps";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

export default function CreateAssignmentWizard() {
  const step = useAssignmentDraftStore((s) => s.step);

  return (
    <div className="flex flex-col items-center gap-8 pt-2 pb-16 px-4">
      {/* Header row */}
      <div className="flex items-center gap-3 w-full max-w-[815px]">
        {/* Green active dot */}
        <div className="size-3 rounded-full bg-green-500 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <h1
            className="text-xl font-bold text-[#303030] leading-[1.4]"
            style={{ letterSpacing: "-0.8px" }}
          >
            Create Assignment
          </h1>
          <p
            className="text-sm font-normal leading-[1.4]"
            style={{ color: "rgba(94,94,94,0.55)", letterSpacing: "-0.56px" }}
          >
            Set up a new assignment for your students
          </p>
        </div>
      </div>

      {/* Progress bars — lines only, no labels */}
      <ProgressSteps total={2} current={step} />

      {step === 0 ? <StepOne /> : <StepTwo />}
    </div>
  );
}
