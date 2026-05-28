"use client";

const TOOLS_ACTIVE = [
  {
    id: "assessment",
    title: "Assessment Creator",
    description: "Generate structured exam papers from curriculum PDFs. Section-wise, typed, Bloom's-aware.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M4 6H18L20 9V20H4V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Active",
    tagColor: "#3ecf5a",
    uses: 14,
  },
  {
    id: "lesson",
    title: "Lesson Planner",
    description: "Draft detailed lesson plans aligned to CBSE/ICSE curriculum with learning objectives and activities.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4C4 4 6 3 12 3C18 3 20 4 20 4V19C20 19 18 18 12 18C6 18 4 19 4 19V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 3V18" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    tag: "Active",
    tagColor: "#3ecf5a",
    uses: 8,
  },
  {
    id: "rubric",
    title: "Rubric Builder",
    description: "Create detailed marking rubrics for long-answer and project-based assessments in minutes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9H21M3 15H21M9 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    tag: "Active",
    tagColor: "#3ecf5a",
    uses: 5,
  },
  {
    id: "feedback",
    title: "Feedback Writer",
    description: "Generate personalised, constructive feedback for student submissions based on answer key criteria.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Active",
    tagColor: "#3ecf5a",
    uses: 11,
  },
];

const TOOLS_SOON = [
  {
    id: "grade",
    title: "Grade Analyser",
    description: "Visualise class performance across sections, topics and Bloom's levels. Spot learning gaps instantly.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3V21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 16L11 10L14 13L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "progress",
    title: "Progress Tracker",
    description: "Track individual student progress over time across all assignments and identify at-risk learners.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "report",
    title: "Parent Report Generator",
    description: "Auto-generate student progress reports in a parent-friendly format for PTM or end-of-term reviews.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M14 2V8H20M9 15H15M9 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ToolkitContent() {
  return (
    <div className="relative min-h-[calc(100vh-82px)] flex flex-col">

      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-3.5 rounded-full bg-[#ff5623] shrink-0" />
          <h1
            className="text-[26px] font-bold text-[#181818] leading-none"
            style={{ letterSpacing: "-1.04px" }}
          >
            AI Teacher's Toolkit
          </h1>
        </div>
        <p className="text-[15px] text-[#5e5e5e] ml-[24px]" style={{ letterSpacing: "-0.48px" }}>
          AI-powered tools to save time and improve learning outcomes.
        </p>
      </div>

      {/* Banner */}
      <div className="px-8 pb-5">
        <div
          className="rounded-[20px] px-7 py-6 flex items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #181818 0%, #2b1a0e 100%)",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-bold text-white" style={{ letterSpacing: "-0.68px" }}>
              Powered by VedaAI
            </h2>
            <p className="text-[14px] text-white/70" style={{ letterSpacing: "-0.48px" }}>
              All tools are trained on CBSE & ICSE syllabi across classes 6–12.
            </p>
          </div>
          <div
            className="shrink-0 size-12 rounded-[14px] flex items-center justify-center"
            style={{ background: "rgba(255,86,35,0.25)", border: "1px solid rgba(255,121,80,0.4)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 8H20L14.75 11.5L16.25 17.5L12 14L7.75 17.5L9.25 11.5L4 8H10.5L12 2Z" fill="#ff7950"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Active tools */}
      <div className="px-8 pb-6">
        <h2 className="text-[15px] font-bold text-[#303030] mb-3" style={{ letterSpacing: "-0.6px" }}>
          Available Now
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {TOOLS_ACTIVE.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-[20px] p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="size-11 rounded-[14px] flex items-center justify-center text-[#ff5623]"
                  style={{ background: "rgba(255,86,35,0.08)" }}
                >
                  {tool.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                    style={{ background: tool.tagColor, letterSpacing: "-0.44px" }}
                  >
                    {tool.tag}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-bold text-[#181818]" style={{ letterSpacing: "-0.6px" }}>
                  {tool.title}
                </h3>
                <p className="text-[13px] text-[#5e5e5e] leading-[1.5]" style={{ letterSpacing: "-0.48px" }}>
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f0f0f0]">
                <span className="text-[13px] text-[#a9a9a9]" style={{ letterSpacing: "-0.48px" }}>
                  Used {tool.uses}× this month
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 h-7 rounded-full bg-[#f0f0f0] text-[12px] font-semibold text-[#303030] hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                  style={{ letterSpacing: "-0.48px" }}
                >
                  Open
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8H12M8.5 4.5L12 8L8.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon tools */}
      <div className="px-8 pb-16">
        <h2 className="text-[15px] font-bold text-[#303030] mb-3" style={{ letterSpacing: "-0.6px" }}>
          Coming Soon
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {TOOLS_SOON.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-[20px] p-5 flex flex-col gap-3 opacity-60"
              style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="size-11 rounded-[14px] flex items-center justify-center text-[#a9a9a9]"
                  style={{ background: "#f6f6f6" }}
                >
                  {tool.icon}
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#5e5e5e]"
                  style={{ background: "#f0f0f0", letterSpacing: "-0.44px" }}
                >
                  Soon
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-bold text-[#181818]" style={{ letterSpacing: "-0.6px" }}>
                  {tool.title}
                </h3>
                <p className="text-[13px] text-[#5e5e5e] leading-[1.5]" style={{ letterSpacing: "-0.48px" }}>
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
