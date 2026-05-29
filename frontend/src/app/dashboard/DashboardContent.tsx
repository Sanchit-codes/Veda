"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import { assignmentsApi } from "@/lib/api";
import AssignmentCard from "./AssignmentCard";

export default function DashboardContent() {
  const { assignments, setAssignments } = useAssignmentStore();

  useEffect(() => {
    assignmentsApi.list().then(({ data }) => setAssignments(data)).catch(console.error);
  }, [setAssignments]);

  return (
    <div className="flex-1 min-h-screen">
      {/* ── Welcome ── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-3 rounded-full bg-green-500 shrink-0" />
          <h1 className="text-2xl font-bold text-[#303030]" style={{ letterSpacing: "-0.96px" }}>
            Hi Madhur 👋
          </h1>
        </div>
        <p className="text-sm text-[rgba(94,94,94,0.9)] ml-5" style={{ letterSpacing: "-0.28px" }}>
          Welcome Back. Ready to create your next assignment?
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-8 pb-6 grid grid-cols-4 gap-4">
        {/* Dark card 1: Assignment Reviewed */}
        <div className="bg-[#2b2b2b] rounded-2xl p-5 flex gap-4 items-center col-span-1">
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-xs font-semibold text-white leading-snug" style={{ letterSpacing: "-0.24px" }}>
              Assignment<br />Reviewed in<br />last 30 days
            </p>
          </div>
          {/* Donut chart */}
          <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
            <svg viewBox="0 0 100 100" width="88" height="88">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#444" strokeWidth="14" />
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#e56820"
                strokeWidth="14"
                strokeDasharray={`${(67 / 80) * 238.76} 238.76`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-white leading-none">67</p>
              <p className="text-[10px] text-gray-400">of 80</p>
            </div>
          </div>
        </div>

        {/* Dark card 2: Time Saved */}
        <div className="bg-[#2b2b2b] rounded-2xl p-5 flex flex-col justify-between col-span-1">
          <p className="text-xs font-semibold text-white" style={{ letterSpacing: "-0.24px" }}>
            Time Saved By AI
          </p>
          <div>
            <p className="text-3xl font-bold text-white tracking-tight">31.7 hrs</p>
            <div className="flex items-center gap-1 mt-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V8M4 5L7 2L10 5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[11px] text-green-400" style={{ letterSpacing: "-0.2px" }}>
                6.5 hrs more than last month
              </p>
            </div>
          </div>
        </div>

        {/* Light card 3: Total Assignments Graded */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between col-span-1 shadow-sm">
          <p className="text-xs font-semibold text-[#303030]" style={{ letterSpacing: "-0.24px" }}>
            Total Assignments Graded
          </p>
          <div>
            <p className="text-3xl font-bold text-[#303030] tracking-tight">128</p>
            <p className="text-[11px] text-[rgba(94,94,94,0.8)] mt-1" style={{ letterSpacing: "-0.2px" }}>
              Submitted, pending evaluation
            </p>
          </div>
        </div>

        {/* Profile illustration */}
        <div className="flex items-center justify-center col-span-1">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
            >
              MR
            </div>
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow" />
            <span className="absolute top-8 -right-3 w-3 h-3 bg-orange-400 rounded-full border border-white shadow" />
            <span className="absolute bottom-1 -right-2 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white shadow" />
          </div>
        </div>
      </div>

      {/* ── Recent Assignments header ── */}
      <div className="px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-green-500 shrink-0" />
          <h2 className="text-base font-semibold text-[#303030]" style={{ letterSpacing: "-0.48px" }}>
            Recent Assignments
          </h2>
        </div>
        <Link
          href="/assignments"
          className="flex items-center gap-1 px-4 py-2 rounded-full bg-white text-sm font-medium text-[#303030] hover:bg-gray-50 transition-colors shadow-sm"
          style={{ letterSpacing: "-0.32px" }}
        >
          View All
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* ── Assignment Cards ── */}
      {assignments.length === 0 ? (
        <div className="px-8 pb-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-[rgba(94,94,94,0.8)]">No assignments yet</p>
          </div>
        </div>
      ) : (
        <div className="px-8 pb-6 grid grid-cols-2 gap-4">
          {assignments.slice(0, 2).map((a) => (
            <AssignmentCard key={a._id} assignment={a} />
          ))}
        </div>
      )}

      {/* ── Feature Cards ── */}
      <div className="px-8 pb-10 grid grid-cols-2 gap-4">
        {/* AI Assignment Grading — orange border */}
        <div
          className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5"
          style={{ border: "1.5px solid #e56820" }}
        >
          <div>
            <h3 className="text-base font-bold text-[#303030] mb-1.5" style={{ letterSpacing: "-0.48px" }}>
              AI Assignment Grading
            </h3>
            <p className="text-sm text-[rgba(94,94,94,0.85)] leading-relaxed" style={{ letterSpacing: "-0.28px" }}>
              Create assignments and automatically evaluate student responses.
            </p>
          </div>
          <Link href="/assignments/new">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-full text-sm font-semibold hover:bg-[#333] transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Create Assignment
            </button>
          </Link>
        </div>

        {/* AI Exam Grading */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between" style={{ border: "1.5px solid #e8e8e8" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#303030] mb-1.5" style={{ letterSpacing: "-0.48px" }}>
                AI Exam Grading
              </h3>
              <p className="text-sm text-[rgba(94,94,94,0.85)] leading-relaxed" style={{ letterSpacing: "-0.28px" }}>
                Automatically evaluate exam papers, generate instant scores, and provide detailed feedback and performance insights.
              </p>
            </div>
            <button className="shrink-0 size-9 rounded-xl bg-[#f0f0f0] flex items-center justify-center hover:bg-[#e4e4e4] transition-colors mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
