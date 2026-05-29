"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  className?: string;
}

export default function TopBar({
  title = "Assignment",
  showBack = true,
  className,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "fixed left-[327px] top-3 h-14 z-10",
        "flex items-center gap-2.5 pl-6 pr-3 rounded-2xl overflow-hidden",
        "w-[calc(100vw-339px)]",
        className
      )}
      style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}
    >
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => router.back()}
          className="size-10 flex items-center justify-center bg-white rounded-full shrink-0 hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6L9 12L15 18"
              stroke="#303030"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Breadcrumb — 4-squares grid icon matching Figma */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
          <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="#a9a9a9" strokeWidth="1.25"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="#a9a9a9" strokeWidth="1.25"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="#a9a9a9" strokeWidth="1.25"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="#a9a9a9" strokeWidth="1.25"/>
        </svg>
        <span
          className="text-base font-semibold text-[#a9a9a9] truncate"
          style={{ letterSpacing: "-0.64px" }}
        >
          {title}
        </span>
      </div>

      {/* Right: help + notifications + user */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Help */}
        <div className="size-9 flex items-center justify-center bg-[#f6f6f6] rounded-full">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="#303030" strokeWidth="1.25"/>
            <path d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.88 11 9.5 10 10.5V11.5" stroke="#303030" strokeWidth="1.25" strokeLinecap="round"/>
            <circle cx="10" cy="14" r="0.75" fill="#303030"/>
          </svg>
        </div>

        {/* Bell */}
        <div className="relative size-9 flex items-center justify-center bg-[#f6f6f6] rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 10C5 7.23858 7.23858 5 10 5H14C16.7614 5 19 7.23858 19 10V15L20.5 17.5H3.5L5 15V10Z"
              stroke="#303030"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M10 17.5C10 18.6046 10.8954 19.5 12 19.5C13.1046 19.5 14 18.6046 14 17.5"
              stroke="#303030"
              strokeWidth="1.25"
            />
          </svg>
          <span className="absolute top-[3px] right-[3px] size-2 bg-[#ff5623] rounded-full" />
        </div>

        {/* User pill */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
          <div className="size-8 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
            MR
          </div>
          <span
            className="text-sm font-semibold text-[#303030]"
            style={{ letterSpacing: "-0.48px" }}
          >
            Madhur Rastogi
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 10L12 14L16 10"
              stroke="#303030"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
