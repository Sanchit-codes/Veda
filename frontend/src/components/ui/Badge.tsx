import { cn } from "@/lib/utils";
import type { Difficulty, BloomsLevel } from "@/types/assignment";

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className: "bg-green-100 text-green-700",
  },
  medium: {
    label: "Moderate",
    className: "bg-amber-100 text-amber-700",
  },
  hard: {
    label: "Challenging",
    className: "bg-red-100 text-red-700",
  },
};

const bloomsConfig: Record<BloomsLevel, { label: string; className: string }> =
  {
    remember: { label: "Remember", className: "bg-blue-100 text-blue-700" },
    understand: {
      label: "Understand",
      className: "bg-indigo-100 text-indigo-700",
    },
    apply: { label: "Apply", className: "bg-violet-100 text-violet-700" },
    analyze: { label: "Analyze", className: "bg-purple-100 text-purple-700" },
    evaluate: {
      label: "Evaluate",
      className: "bg-fuchsia-100 text-fuchsia-700",
    },
    create: { label: "Create", className: "bg-pink-100 text-pink-700" },
  };

interface DifficultyBadgeProps {
  level: Difficulty;
  className?: string;
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-[-0.48px]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface BloomsBadgeProps {
  level: BloomsLevel;
  className?: string;
}

export function BloomsBadge({ level, className }: BloomsBadgeProps) {
  const config = bloomsConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-[-0.48px]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface CountBadgeProps {
  count: number;
  className?: string;
}

export function CountBadge({ count, className }: CountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ff5623] text-white tracking-[-0.48px]",
        className
      )}
    >
      {count}
    </span>
  );
}
