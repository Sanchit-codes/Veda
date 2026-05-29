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
    <div className="flex-1 bg-white overflow-y-auto">
      {/* ── Welcome Section ── */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[32px] font-bold text-[#303030]" style={{ letterSpacing: "-1.28px" }}>
            Hi Madhur 👋
          </h1>
        </div>
        <p className="text-base text-[rgba(94,94,94,0.8)]" style={{ letterSpacing: "-0.32px" }}>
          Welcome Back. Ready to create your next assignment?
        </p>
      </div>

      {/* ── Stats Cards Row ── */}
      <div className="px-8 py-6 grid grid-cols-4 gap-4">
        {/* Card 1: Assignment Reviewed */}
        <div className="bg-[#2a2a2a] rounded-2xl p-6 flex flex-col items-start gap-4">
          <p className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.28px" }}>
            Assignment<br/>Reviewed in<br/>last 30 days
          </p>
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#404040" strokeWidth="12"/>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="12"
                  strokeDasharray={`${(67/80) * 282.7} 282.7`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-white">67</p>
                <p className="text-xs text-gray-400">of 80</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Time Saved */}
        <div className="bg-[#2a2a2a] rounded-2xl p-6 flex flex-col items-start gap-4">
          <p className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.28px" }}>
            Time Saved By AI
          </p>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-3xl font-bold text-white tracking-tight">31.7 hrs</p>
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V9M3.5 5.5L7 2L10.5 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-xs text-green-400">6.5 hrs more than last month</p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Assignments Graded */}
        <div className="bg-white rounded-2xl p-6 flex flex-col items-start gap-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-[#303030]" style={{ letterSpacing: "-0.28px" }}>
            Total Assignments Graded
          </p>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-3xl font-bold text-[#303030] tracking-tight">128</p>
            <p className="text-xs text-[rgba(94,94,94,0.8)]">Submitted, pending evaluation</p>
          </div>
        </div>

        {/* Card 4: User Profile */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold">
              MR
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-white"></div>
            <div className="absolute -top-2 -right-3 w-4 h-4 bg-orange-500 rounded-full border border-white"></div>
            <div className="absolute top-8 -right-2 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
          </div>
        </div>
      </div>

      {/* ── Recent Assignments ── */}
      <div className="px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#303030]" style={{ letterSpacing: "-0.56px" }}>
            Recent Assignments
          </h2>
          <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-[#303030] hover:bg-gray-50 transition-colors">
            View All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Assignment Cards Grid ── */}
      {assignments.length === 0 ? (
        <div className="px-8 py-12">
          <div className="text-center">
            <p className="text-base text-[rgba(94,94,94,0.8)] mb-4">No assignments yet</p>
            <Link href="/assignments/new">
              <button className="px-6 py-2 bg-[#181818] text-white rounded-full text-sm font-semibold hover:bg-[#2b2b2b] transition-colors">
                Create Your First Assignment
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-8 py-6 grid grid-cols-2 gap-4">
          {assignments.slice(0, 2).map((a) => (
            <AssignmentCard key={a._id} assignment={a} />
          ))}
        </div>
      )}

      {/* ── Feature Cards ── */}
      <div className="px-8 py-6 grid grid-cols-2 gap-4">
        {/* AI Assignment Grading */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#303030] mb-2" style={{ letterSpacing: "-0.56px" }}>
                AI Assignment Grading
              </h3>
              <p className="text-sm text-[rgba(94,94,94,0.8)] leading-relaxed">
                Create assignments and automatically evaluate student responses.
              </p>
            </div>
          </div>
          <Link href="/assignments/new">
            <button className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#181818] text-white rounded-full text-sm font-semibold hover:bg-[#2b2b2b] transition-colors">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Assignment
            </button>
          </Link>
        </div>

        {/* AI Exam Grading */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#303030] mb-2" style={{ letterSpacing: "-0.56px" }}>
                AI Exam Grading
              </h3>
              <p className="text-sm text-[rgba(94,94,94,0.8)] leading-relaxed">
                Automatically evaluate exam papers, generate instant scores, and provide detailed feedback and performance insights.
              </p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5L14 12L9 19" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}
