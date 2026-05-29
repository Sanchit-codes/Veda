import Link from "next/link";
import type { AssignmentListItem } from "@/types/assignment";

const statusConfig = {
  draft: { label: "Draft", className: "bg-[#f0f0f0] text-[#5e5e5e]" },
  generating: { label: "Generating…", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Active", className: "bg-green-100 text-green-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-600" },
};

export default function AssignmentCard({ assignment }: { assignment: AssignmentListItem }) {
  const status = statusConfig[assignment.status] || { label: "Closed", className: "bg-[#e5e5e5] text-[#5e5e5e]" };

  const createdDate = new Date(assignment.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dueDate = new Date(assignment.createdAt);
  dueDate.setDate(dueDate.getDate() + 1);
  const dueDateStr = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const submissionCount = Math.floor(Math.random() * 50) + 1;
  const totalStudents = 50;
  const progressPercent = (submissionCount / totalStudents) * 100;

  return (
    <Link
      href={
        assignment.status === "completed"
          ? `/assignments/${assignment._id}/output`
          : `/assignments/${assignment._id}`
      }
      className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      {/* ── Header with Title & Status Badge ── */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-[#303030] tracking-[-0.56px] line-clamp-2 flex-1">
          {assignment.title}
        </h3>
        <button className="text-[#5e5e5e] hover:text-[#303030] transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* ── Metadata: Class, Subject, Status ── */}
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" className="text-[#5e5e5e]"/>
        </svg>
        <p className="text-xs font-medium text-[#5e5e5e] tracking-[-0.32px]">
          Class 10-A · {assignment.subject}
        </p>
        <span
          className="ml-auto px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: status.className === "bg-green-100 text-green-700" ? "#dcfce7" : "#e5e5e5",
            color: status.className === "bg-green-100 text-green-700" ? "#16a34a" : "#5e5e5e"
          }}
        >
          {status.label}
        </span>
      </div>

      {/* ── Submission Stats & Dates ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#303030] tracking-tight">
              {submissionCount}/{totalStudents}
            </p>
            <p className="text-xs text-[#5e5e5e]">Submitted</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[#303030] tracking-[-0.32px]">
              Assigned on: {createdDate}
            </p>
            <p className="text-xs font-semibold text-[#303030] tracking-[-0.32px]">
              Due: {dueDateStr}
            </p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Link>
  );
}
