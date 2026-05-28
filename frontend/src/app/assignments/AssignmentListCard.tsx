"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AssignmentListItem } from "@/types/assignment";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

interface Props {
  assignment: AssignmentListItem;
  onDelete: (id: string) => void;
}

export default function AssignmentListCard({ assignment, onDelete }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  const assignedDate = formatDate(assignment.createdAt);

  // If dueDate is set, show it; otherwise default to createdAt + 1 day
  const dueDateRaw = assignment.dueDate
    ? new Date(assignment.dueDate)
    : (() => { const d = new Date(assignment.createdAt); d.setDate(d.getDate() + 1); return d; })();
  const dueDate = formatDate(dueDateRaw.toISOString());

  const viewHref =
    assignment.status === "completed"
      ? `/assignments/${assignment._id}/output`
      : `/assignments/${assignment._id}`;

  return (
    <div
      className="bg-white rounded-[20px] p-5 flex flex-col justify-between cursor-pointer select-none"
      style={{
        boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
        minHeight: "150px",
      }}
      onClick={() => router.push(viewHref)}
    >
      {/* Top row: title + three-dot */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className="text-[19px] font-bold text-[#181818] leading-[1.3] tracking-[-0.76px]"
          style={{ wordBreak: "break-word" }}
        >
          {assignment.title}
        </h3>

        {/* Three-dot button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="size-8 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="4.5" r="1.5" fill="#5e5e5e"/>
              <circle cx="10" cy="10" r="1.5" fill="#5e5e5e"/>
              <circle cx="10" cy="15.5" r="1.5" fill="#5e5e5e"/>
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl overflow-hidden"
              style={{
                boxShadow: "0px 8px 24px rgba(0,0,0,0.12), 0px 2px 6px rgba(0,0,0,0.06)",
                minWidth: "160px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push(viewHref);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[#303030] hover:bg-[#f6f6f6] transition-colors cursor-pointer"
                style={{ letterSpacing: "-0.48px" }}
              >
                View Assignment
              </button>
              <div className="h-px bg-[#f0f0f0]" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(assignment._id);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[#e03131] hover:bg-red-50 transition-colors cursor-pointer"
                style={{ letterSpacing: "-0.48px" }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Assigned on + Due */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-[14px] text-[#303030]" style={{ letterSpacing: "-0.5px" }}>
          <span className="font-bold">Assigned on</span>
          <span className="font-normal"> : {assignedDate}</span>
        </p>
        <p className="text-[14px] text-[#303030]" style={{ letterSpacing: "-0.5px" }}>
          <span className="font-bold">Due</span>
          <span className="font-normal"> : {dueDate}</span>
        </p>
      </div>
    </div>
  );
}
