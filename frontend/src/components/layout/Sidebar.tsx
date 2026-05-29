"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/",
    exact: true,
    badge: null,
    icon: (
      /* 2×2 grid squares — matches Figma */
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
      </svg>
    ),
  },
  {
    label: "My Groups",
    href: "/groups",
    exact: false,
    badge: null,
    icon: (
      /* Two people/users icon */
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7.5" cy="7" r="3" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M1 17C1 14.2386 4.02944 12 7.5 12C8.38 12 9.22 12.17 10 12.48" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        <circle cx="14" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M10.5 16.5C10.5 14.567 12.067 13 14 13C15.933 13 17.5 14.567 17.5 16.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Assignments",
    href: "/assignments",
    exact: false,
    badge: null,
    icon: (
      /* Document / file-text icon */
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 3H13L16 6V17H4V3Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
        <path d="M12.5 3V6.5H16" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
        <path d="M7 9.5H13M7 12.5H11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "AI Teacher's Toolkit",
    href: "/toolkit",
    exact: false,
    badge: null,
    icon: (
      /* Open book icon */
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4C3 4 5 3 10 3C15 3 17 4 17 4V16C17 16 15 15 10 15C5 15 3 16 3 16V4Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
        <path d="M10 3V15" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M6 6.5H8.5M6 9H8.5M6 11.5H8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M11.5 6.5H14M11.5 9H14M11.5 11.5H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "My Library",
    href: "/library",
    exact: false,
    badge: 32,
    icon: (
      /* Person / user icon */
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M3 18C3 15.2386 6.13401 13 10 13C13.866 13 17 15.2386 17 18" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-3 top-3 bottom-3 w-[304px] bg-white rounded-2xl flex flex-col justify-between p-6 z-20"
      style={{ boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)" }}
    >
      {/* ── Top ── */}
      <div className="flex flex-col gap-14">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="VedaAI"
            className="size-10 rounded-[10px] shrink-0 object-cover"
          />
          <span
            className="text-[28px] font-bold text-[#303030] leading-none"
            style={{ letterSpacing: "-1.68px" }}
          >
            VedaAI
          </span>
        </div>

        {/* Create Assignment CTA — sparkle icon */}
        <Link
          href="/assignments/new"
          className="flex items-center justify-center gap-2 w-full h-[42px] rounded-full text-base font-medium text-white transition-opacity hover:opacity-90"
          style={{
            background: "#272727",
            border: "4px solid #ff7950",
            boxShadow: "inset 0px -1px 3.5px rgba(177,177,177,0.6), inset 0px 0px 34.5px rgba(255,255,255,0.25)",
            letterSpacing: "-0.64px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Figma sparkle/AI icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L10.5 6.75H15.75L11.625 9.75L13.125 15L9 12L4.875 15L6.375 9.75L2.25 6.75H7.5L9 1.5Z" fill="white"/>
          </svg>
          Create Assignment
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            // Home (exact) = only /assignments itself
            // Assignments (not exact) = /assignments/* sub-pages
            // All others = exact match or prefix
            const isActive = item.exact
              ? pathname === item.href
              : item.href === "/assignments"
              ? pathname.startsWith("/assignments/")
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg text-base transition-colors w-full",
                  isActive
                    ? "bg-[#f0f0f0] font-medium text-[#303030] px-3 py-[9px]"
                    : "font-normal text-[rgba(94,94,94,0.8)] hover:bg-[#f6f6f6] px-3 py-2"
                )}
                style={{ letterSpacing: "-0.64px" }}
              >
                <span className="shrink-0 size-5 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== null && (
                  <span
                    className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: "#ff5623", letterSpacing: "-0.48px" }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom ── */}
      <div className="flex flex-col gap-2">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 text-base font-normal text-[rgba(94,94,94,0.8)] hover:bg-[#f6f6f6] rounded-lg transition-colors"
          style={{ letterSpacing: "-0.64px" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
            <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M4.22 15.78L5.64 14.36M14.36 5.64L15.78 4.22" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
          Settings
        </Link>

        {/* User card */}
        <div className="bg-[#f0f0f0] rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <div
              className="shrink-0 rounded-full bg-[#e56820] flex items-center justify-center text-white font-bold overflow-hidden"
              style={{ width: 56, height: 56, fontSize: 18 }}
            >
              D
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-base font-bold text-[#303030] truncate leading-[1.4]"
                style={{ letterSpacing: "-0.64px" }}
              >
                Delhi Public School
              </span>
              <span
                className="text-sm text-[#5e5e5e] truncate leading-[1.4]"
                style={{ letterSpacing: "-0.56px" }}
              >
                Bokaro Steel City
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
