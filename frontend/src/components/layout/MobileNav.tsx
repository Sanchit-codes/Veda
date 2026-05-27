"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Home",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 7.5L10 2.5L17.5 7.5V17.5H12.5V12.5H7.5V17.5H2.5V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M7 7H13M7 10H11M7 13H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Library",
    href: "/library",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4H7V17H3V4ZM9 4H13V17H9V4ZM15 4H17V17H15V4Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "AI Toolkit",
    href: "/toolkit",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 pb-safe px-2.5 pb-4">
      {/* FAB */}
      <div className="flex justify-end mb-3 pr-1">
        <Link
          href="/assignments/new"
          className="size-12 rounded-full bg-white flex items-center justify-center text-[#303030] hover:bg-[#f0f0f0] transition-colors"
          style={{ boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)" }}
          aria-label="Create assignment"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>

      {/* Bottom pill nav */}
      <nav
        className="flex items-center justify-between px-6 py-2 rounded-3xl h-[72px]"
        style={{ background: "#181818" }}
      >
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 size-[52px] rounded-[26px] transition-colors",
                isActive ? "bg-transparent" : ""
              )}
            >
              <span className={cn(isActive ? "text-white" : "text-white/25")}>
                {tab.icon}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold tracking-[-0.48px]",
                  isActive ? "text-white" : "text-white/25"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
