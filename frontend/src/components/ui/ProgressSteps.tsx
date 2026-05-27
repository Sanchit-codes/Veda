import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  total: number;
  current: number;
  className?: string;
}

export default function ProgressSteps({ total, current, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center gap-3 w-full max-w-[815px]", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-0.5 rounded-full transition-all",
            i <= current ? "bg-[#303030]" : "bg-[#dadada]"
          )}
        />
      ))}
    </div>
  );
}
