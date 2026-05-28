"use client";

import { useEffect } from "react";
import Link from "next/link";
import EmptyIllustration from "@/components/ui/EmptyIllustration";
import Button from "@/components/ui/Button";
import { useAssignmentStore } from "@/stores/useAssignmentStore";
import { assignmentsApi } from "@/lib/api";
import AssignmentCard from "./AssignmentCard";

export default function DashboardContent() {
  const { assignments, setAssignments } = useAssignmentStore();

  useEffect(() => {
    assignmentsApi.list().then(({ data }) => setAssignments(data)).catch(console.error);
  }, [setAssignments]);

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-8">
        <div className="flex flex-col items-center gap-3">
          <EmptyIllustration size={300} />
          <div className="flex flex-col items-center gap-0.5 text-center max-w-[486px]">
            <h2 className="text-xl font-bold text-[#303030] tracking-[-0.8px] leading-[1.4]">
              No assignments yet
            </h2>
            <p className="text-base font-normal text-[rgba(94,94,94,0.8)] tracking-[-0.64px] leading-[1.4]">
              Create your first assignment to start collecting and grading
              student submissions. You can set up rubrics, define marking
              criteria, and let AI assist with grading.
            </p>
          </div>
        </div>
        <Link href="/assignments/new">
          <Button variant="dark" iconLeft={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }>
            Create Your First Assignment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#303030] tracking-[-0.8px]">
          Your Assignments
        </h1>
        <Link href="/assignments/new">
          <Button variant="dark" size="sm" iconLeft={
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }>
            New Assignment
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <AssignmentCard key={a._id} assignment={a} />
        ))}
      </div>
    </div>
  );
}
