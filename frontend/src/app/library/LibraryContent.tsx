"use client";

import { useState } from "react";

const SUBJECT_COLORS: Record<string, string> = {
  Science: "#4f8ef7",
  Mathematics: "#ff5623",
  "Social Science": "#3ecf5a",
  English: "#a855f7",
  Hindi: "#f59e0b",
  Physics: "#06b6d4",
  Chemistry: "#e03131",
  Biology: "#10b981",
};

const DOCUMENTS = [
  { id: "1",  title: "NCERT Science Class 8 — Chapter 5 Summary",          subject: "Science",       type: "PDF",  size: "1.2 MB", date: "12-05-2026", used: 3  },
  { id: "2",  title: "Chemical Reactions & Equations Notes",                 subject: "Chemistry",     type: "PDF",  size: "890 KB", date: "10-05-2026", used: 1  },
  { id: "3",  title: "Quadratic Equations Practice Set — Class 10",          subject: "Mathematics",   type: "PDF",  size: "540 KB", date: "09-05-2026", used: 5  },
  { id: "4",  title: "French Revolution — Key Events & Causes",              subject: "Social Science", type: "PDF", size: "780 KB", date: "08-05-2026", used: 2  },
  { id: "5",  title: "English Grammar — Tenses Comprehensive Guide",         subject: "English",       type: "PDF",  size: "1.1 MB", date: "07-05-2026", used: 4  },
  { id: "6",  title: "Motion & Laws of Motion — Physics Class 9",            subject: "Physics",       type: "PDF",  size: "950 KB", date: "05-05-2026", used: 2  },
  { id: "7",  title: "Cell Structure and Function — Biology Class 9",        subject: "Biology",       type: "PDF",  size: "1.4 MB", date: "04-05-2026", used: 6  },
  { id: "8",  title: "Hindi Vyakaran — Sandhi Viched Practice",              subject: "Hindi",         type: "PDF",  size: "620 KB", date: "03-05-2026", used: 1  },
  { id: "9",  title: "Arithmetic Progressions — Class 10 Complete Notes",    subject: "Mathematics",   type: "PDF",  size: "700 KB", date: "01-05-2026", used: 3  },
  { id: "10", title: "Acids, Bases and Salts — Experiment Notes",            subject: "Chemistry",     type: "PDF",  size: "830 KB", date: "29-04-2026", used: 2  },
  { id: "11", title: "Nationalism in India — Class 10 NCERT Chapter",       subject: "Social Science", type: "PDF", size: "1.0 MB", date: "27-04-2026", used: 4  },
  { id: "12", title: "Light — Reflection and Refraction Problems",           subject: "Physics",       type: "PDF",  size: "760 KB", date: "25-04-2026", used: 3  },
];

const ALL_SUBJECTS = ["All", ...Array.from(new Set(DOCUMENTS.map((d) => d.subject)))];

export default function LibraryContent() {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  const filtered = DOCUMENTS.filter((doc) => {
    const matchesSearch =
      !search.trim() ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = activeSubject === "All" || doc.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="relative min-h-[calc(100vh-82px)] flex flex-col">

      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-3.5 rounded-full bg-[#a855f7] shrink-0" />
          <h1
            className="text-[26px] font-bold text-[#181818] leading-none"
            style={{ letterSpacing: "-1.04px" }}
          >
            My Library
          </h1>
        </div>
        <p className="text-[15px] text-[#5e5e5e] ml-[24px]" style={{ letterSpacing: "-0.48px" }}>
          Source documents and study materials used in your assignments.
        </p>
      </div>

      {/* Search + Upload */}
      <div className="px-8 pb-5">
        <div
          className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between gap-4"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="relative flex-1 max-w-[360px]">
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
              placeholder="Search documents…"
              className="w-full h-10 pl-10 pr-4 rounded-full text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none"
              style={{ background: "#f6f6f6", letterSpacing: "-0.48px" }}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-5 h-9 rounded-full bg-[#181818] text-white text-sm font-semibold hover:bg-[#2b2b2b] transition-colors cursor-pointer shrink-0"
            style={{ letterSpacing: "-0.48px" }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V17M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Upload
          </button>
        </div>
      </div>

      {/* Subject filter pills */}
      <div className="px-8 pb-4 flex items-center gap-2 flex-wrap">
        {ALL_SUBJECTS.map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setActiveSubject(subj)}
            className="px-4 h-8 rounded-full text-[13px] font-medium transition-colors cursor-pointer"
            style={{
              background: activeSubject === subj ? "#181818" : "rgba(255,255,255,0.8)",
              color: activeSubject === subj ? "white" : "#5e5e5e",
              letterSpacing: "-0.48px",
              border: activeSubject === subj ? "none" : "1px solid #e8e8e8",
            }}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="px-8 pb-4">
        <p className="text-[13px] text-[#a9a9a9]" style={{ letterSpacing: "-0.48px" }}>
          {filtered.length} of {DOCUMENTS.length} documents
        </p>
      </div>

      {/* Document list */}
      <div className="px-8 pb-16 flex flex-col gap-3">
        {filtered.map((doc) => {
          const color = SUBJECT_COLORS[doc.subject] ?? "#a9a9a9";
          return (
            <div
              key={doc.id}
              className="bg-white rounded-[18px] px-5 py-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
            >
              {/* PDF icon */}
              <div
                className="size-10 rounded-[12px] flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <h3 className="text-[14px] font-semibold text-[#181818] truncate" style={{ letterSpacing: "-0.56px" }}>
                  {doc.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
                    style={{ background: color, letterSpacing: "-0.44px" }}
                  >
                    {doc.subject}
                  </span>
                  <span className="text-[12px] text-[#a9a9a9]" style={{ letterSpacing: "-0.44px" }}>
                    {doc.size} · {doc.date}
                  </span>
                </div>
              </div>

              {/* Used badge + actions */}
              <div className="flex items-center gap-3 shrink-0">
                {doc.used > 0 && (
                  <span className="text-[12px] text-[#a9a9a9]" style={{ letterSpacing: "-0.44px" }}>
                    Used in {doc.used} {doc.used === 1 ? "assignment" : "assignments"}
                  </span>
                )}
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4.5" r="1.5" fill="#5e5e5e"/>
                    <circle cx="10" cy="10" r="1.5" fill="#5e5e5e"/>
                    <circle cx="10" cy="15.5" r="1.5" fill="#5e5e5e"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
