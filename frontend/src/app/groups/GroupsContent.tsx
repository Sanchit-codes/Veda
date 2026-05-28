"use client";

const GROUPS = [
  {
    id: "1",
    name: "Class 8A",
    subject: "Science",
    students: 34,
    assignments: 7,
    color: "#ff5623",
    initials: "8A",
  },
  {
    id: "2",
    name: "Class 9B",
    subject: "Mathematics",
    students: 28,
    assignments: 5,
    color: "#4f8ef7",
    initials: "9B",
  },
  {
    id: "3",
    name: "Class 10C",
    subject: "Social Science",
    students: 36,
    assignments: 9,
    color: "#3ecf5a",
    initials: "10C",
  },
  {
    id: "4",
    name: "Class 7A",
    subject: "English",
    students: 40,
    assignments: 4,
    color: "#a855f7",
    initials: "7A",
  },
  {
    id: "5",
    name: "Class 8B",
    subject: "Hindi",
    students: 31,
    assignments: 3,
    color: "#f59e0b",
    initials: "8B",
  },
  {
    id: "6",
    name: "Class 11A",
    subject: "Physics",
    students: 22,
    assignments: 6,
    color: "#06b6d4",
    initials: "11A",
  },
];

const AVATAR_COLORS = ["#ff5623", "#4f8ef7", "#3ecf5a", "#a855f7", "#f59e0b", "#06b6d4", "#e03131", "#0ea5e9"];

export default function GroupsContent() {
  return (
    <div className="relative min-h-[calc(100vh-82px)] flex flex-col">

      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-3.5 rounded-full bg-[#4f8ef7] shrink-0" />
          <h1
            className="text-[26px] font-bold text-[#181818] leading-none"
            style={{ letterSpacing: "-1.04px" }}
          >
            My Groups
          </h1>
        </div>
        <p className="text-[15px] text-[#5e5e5e] ml-[24px]" style={{ letterSpacing: "-0.48px" }}>
          Manage your classes and student groups.
        </p>
      </div>

      {/* Toolbar */}
      <div className="px-8 pb-5">
        <div
          className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between gap-4"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-2 text-[15px] font-medium text-[#5e5e5e]" style={{ letterSpacing: "-0.48px" }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <circle cx="7.5" cy="7" r="3" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M1 17C1 14.2386 4.02944 12 7.5 12C8.38 12 9.22 12.17 10 12.48" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <circle cx="14" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M10.5 16.5C10.5 14.567 12.067 13 14 13C15.933 13 17.5 14.567 17.5 16.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            {GROUPS.reduce((s, g) => s + g.students, 0)} students across {GROUPS.length} groups
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-5 h-9 rounded-full bg-[#181818] text-white text-sm font-semibold hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            style={{ letterSpacing: "-0.48px" }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Group
          </button>
        </div>
      </div>

      {/* Group cards */}
      <div className="px-8 pb-16">
        <div className="grid grid-cols-2 gap-4">
          {GROUPS.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-[20px] p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-[14px] flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ background: group.color, letterSpacing: "-0.5px" }}
                  >
                    {group.initials}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#181818]" style={{ letterSpacing: "-0.68px" }}>
                      {group.name}
                    </h3>
                    <p className="text-[13px] text-[#5e5e5e]" style={{ letterSpacing: "-0.5px" }}>
                      {group.subject}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="size-7 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4.5" r="1.5" fill="#5e5e5e"/>
                    <circle cx="10" cy="10" r="1.5" fill="#5e5e5e"/>
                    <circle cx="10" cy="15.5" r="1.5" fill="#5e5e5e"/>
                  </svg>
                </button>
              </div>

              {/* Student avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {AVATAR_COLORS.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="size-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: c, zIndex: 4 - i }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[13px] text-[#5e5e5e]" style={{ letterSpacing: "-0.48px" }}>
                  +{group.students - 4} more
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f0f0f0]">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <circle cx="7.5" cy="7" r="3" stroke="#a9a9a9" strokeWidth="1.25"/>
                    <path d="M1 17C1 14.2386 4.02944 12 7.5 12" stroke="#a9a9a9" strokeWidth="1.25" strokeLinecap="round"/>
                    <circle cx="14" cy="7.5" r="2.5" stroke="#a9a9a9" strokeWidth="1.25"/>
                    <path d="M10.5 16.5C10.5 14.567 12.067 13 14 13C15.933 13 17.5 14.567 17.5 16.5" stroke="#a9a9a9" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[13px] text-[#5e5e5e]" style={{ letterSpacing: "-0.48px" }}>
                    {group.students} students
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M4 3H13L16 6V17H4V3Z" stroke="#a9a9a9" strokeWidth="1.25" strokeLinejoin="round"/>
                    <path d="M7 9.5H13M7 12.5H11" stroke="#a9a9a9" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[13px] text-[#5e5e5e]" style={{ letterSpacing: "-0.48px" }}>
                    {group.assignments} assignments
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
