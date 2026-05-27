"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function Stepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white rounded-full px-2 py-2.5 w-[100px]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="size-4 flex items-center justify-center text-[#303030] hover:text-[#ff5623] transition-colors cursor-pointer"
        aria-label="Decrease"
      >
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
          <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className="text-base font-medium text-[#303030] tracking-[-0.64px] tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="size-4 flex items-center justify-center text-[#303030] hover:text-[#ff5623] transition-colors cursor-pointer"
        aria-label="Increase"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
