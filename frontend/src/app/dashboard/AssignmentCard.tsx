import Link from "next/link";
import type { AssignmentListItem } from "@/types/assignment";

export default function AssignmentCard({ assignment }: { assignment: AssignmentListItem }) {
  const assignedDate = new Date(assignment.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");

  const dueDate = new Date(assignment.createdAt);
  dueDate.setDate(dueDate.getDate() + 1);
  const dueDateStr = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");

  const isActive = assignment.status === "completed";
  const submitted = Math.floor(Math.random() * 50) + 1;
  const total = 50;

  return (
    <Link
      href={isActive ? `/assignments/${assignment._id}/output` : `/assignments/${assignment._id}`}
      className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow shadow-sm"
      style={{ border: "1.5px solid #efefef" }}
    >
      {/* Title + badge + menu */}
      <div className="flex items-start gap-2">
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-[#303030]" style={{ letterSpacing: "-0.48px" }}>
            {assignment.title}
          </h3>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0"
            style={isActive
              ? { background: "#dcfce7", color: "#16a34a" }
              : { background: "#e5e5e5", color: "#5e5e5e" }}
          >
            {isActive ? "Active" : "Closed"}
          </span>
        </div>
        <button className="text-[#a9a9a9] hover:text-[#5e5e5e] transition-colors">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            <circle cx="10" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Class + Subject */}
      <div className="flex items-center gap-2 text-xs text-[#5e5e5e]" style={{ letterSpacing: "-0.24px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>Class 10-A</span>
        <span className="size-1 rounded-full bg-[#c4c4c4]" />
        <span>{assignment.subject}</span>
      </div>

      {/* Submitted + Dates */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-[#303030] tracking-tight">
            {submitted}/{total}
          </p>
          <p className="text-xs text-[#5e5e5e]" style={{ letterSpacing: "-0.2px" }}>Submitted</p>
        </div>
        <div className="text-right text-xs" style={{ letterSpacing: "-0.24px" }}>
          <p>
            <span className="font-bold text-[#303030]">Assigned on</span>
            <span className="text-[#5e5e5e]"> : {assignedDate}</span>
          </p>
          <p>
            <span className="font-bold text-[#303030]">Due</span>
            <span className="text-[#5e5e5e]"> : {dueDateStr}</span>
          </p>
        </div>
      </div>

      {/* Orange progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(submitted / total) * 100}%`, background: "#e56820" }}
        />
      </div>
    </Link>
  );
}
