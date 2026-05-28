import Link from "next/link";
import type { AssignmentListItem } from "@/types/assignment";
import { cn } from "@/lib/utils";

const statusConfig = {
  draft: { label: "Draft", className: "bg-[#f0f0f0] text-[#5e5e5e]" },
  generating: { label: "Generating…", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-600" },
};

export default function AssignmentCard({ assignment }: { assignment: AssignmentListItem }) {
  const status = statusConfig[assignment.status];
  const date = new Date(assignment.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={
        assignment.status === "completed"
          ? `/assignments/${assignment._id}/output`
          : `/assignments/${assignment._id}`
      }
      className="bg-white rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
      style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-[#303030] tracking-[-0.64px] leading-[1.4] line-clamp-2">
            {assignment.title}
          </h3>
          <p className="text-sm text-[#5e5e5e] tracking-[-0.56px]">
            {assignment.subject} · Class {assignment.className}
          </p>
        </div>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold shrink-0",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#a9a9a9] tracking-[-0.48px]">
        <span>{assignment.sectionCount} section{assignment.sectionCount !== 1 ? "s" : ""}</span>
        <span>{assignment.totalMarks} marks</span>
        <span>{date}</span>
      </div>
    </Link>
  );
}
