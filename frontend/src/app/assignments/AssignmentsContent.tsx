"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import { assignmentsApi } from "@/lib/api";
import EmptyIllustration from "@/components/ui/EmptyIllustration";
import Button from "@/components/ui/Button";
import AssignmentListCard from "./AssignmentListCard";

export default function AssignmentsContent() {
  const { assignments, setAssignments } = useAssignmentStore();
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    assignmentsApi
      .list()
      .then(({ data }) => {
        setFetchError(null);
        setAssignments(data);
      })
      .catch((err) => {
        console.error(err);
        setFetchError("Could not load assignments. Check your connection.");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function requestDelete(id: string) {
    setConfirmId(id);
  }

  async function confirmDelete() {
    if (!confirmId) return;
    setDeleting(true);
    await assignmentsApi.delete(confirmId).catch(console.error);
    setAssignments(assignments.filter((a) => a._id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
  }

  const filtered = search.trim()
    ? assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.subject?.toLowerCase().includes(search.toLowerCase())
      )
    : assignments;

  const confirmTarget = assignments.find((a) => a._id === confirmId);
  const isEmpty = filtered.length === 0;

  return (
    <div className="relative min-h-[calc(100vh-82px)] flex flex-col">

      {/* ── API error banner ── */}
      {fetchError && (
        <div className="mx-8 mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {fetchError}
        </div>
      )}

      {/* ── Page header — only show if not empty ── */}
      {!isEmpty && (
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-3.5 rounded-full bg-[#3ecf5a] shrink-0" />
            <h1
              className="text-[26px] font-bold text-[#181818] leading-none"
              style={{ letterSpacing: "-1.04px" }}
            >
              Assignments
            </h1>
          </div>
          <p className="text-[15px] text-[#5e5e5e] ml-[24px]" style={{ letterSpacing: "-0.48px" }}>
            Manage and create assignments for your classes.
          </p>
        </div>
      )}

      {/* ── Toolbar: Filter + Search — only show if not empty ── */}
      {!isEmpty && (
        <div className="px-8 pb-5">
          <div
            className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between gap-4"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
          >
            <button
              type="button"
              className="flex items-center gap-2 text-[15px] font-medium text-[#5e5e5e] hover:text-[#303030] transition-colors cursor-pointer"
              style={{ letterSpacing: "-0.48px" }}
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M3 5H17M6 10H14M9 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Filter By
            </button>

            <div className="relative max-w-[360px] w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9a9a9] pointer-events-none"
                width="16" height="16" viewBox="0 0 20 20" fill="none"
              >
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Assignment"
                className="w-full h-10 pl-10 pr-4 rounded-full text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none"
                style={{ background: "#f6f6f6", letterSpacing: "-0.48px" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Cards grid ── */}
      <div className="px-8 pb-32 flex-1">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <div className="flex flex-col items-center gap-6">
              <EmptyIllustration size={350} />
              <div className="flex flex-col items-center gap-2 text-center max-w-[550px]">
                <h2 className="text-2xl font-bold text-[#303030] tracking-[-0.8px] leading-[1.4]">
                  {search ? "No assignments match" : "No assignments yet"}
                </h2>
                <p className="text-base font-normal text-[rgba(94,94,94,0.8)] tracking-[-0.64px] leading-[1.6]">
                  {search
                    ? "Try adjusting your search filters or create a new assignment."
                    : "Create your first assignment to start collecting and grading student submissions."}
                </p>
              </div>
            </div>
            {!search && (
              <Link href="/assignments/new">
                <Button
                  variant="dark"
                  iconLeft={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                >
                  Create Your First Assignment
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((a) => (
              <AssignmentListCard
                key={a._id}
                assignment={a}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
          onClick={() => !deleting && setConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl p-7 flex flex-col gap-5 max-w-sm w-full mx-6"
            style={{ boxShadow: "0px 24px 48px rgba(0,0,0,0.18)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21" stroke="#e03131" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 6V4H16V6M19 6L18 20H6L5 6" stroke="#e03131" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11V17M14 11V17" stroke="#e03131" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Text */}
            <div className="text-center flex flex-col gap-1">
              <h3
                className="text-[17px] font-bold text-[#181818]"
                style={{ letterSpacing: "-0.68px" }}
              >
                Delete Assignment?
              </h3>
              <p className="text-sm text-[#5e5e5e]" style={{ letterSpacing: "-0.48px" }}>
                {confirmTarget
                  ? `"${confirmTarget.title}" will be permanently deleted.`
                  : "This assignment will be permanently deleted."}
                {" "}This cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmId(null)}
                className="flex-1 h-11 rounded-full border border-[#e8e8e8] text-sm font-semibold text-[#303030] hover:bg-[#f6f6f6] transition-colors cursor-pointer disabled:opacity-50"
                style={{ letterSpacing: "-0.48px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 h-11 rounded-full bg-[#e03131] text-sm font-semibold text-white hover:bg-[#c92a2a] transition-colors cursor-pointer disabled:opacity-50"
                style={{ letterSpacing: "-0.48px" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
