import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  topBarTitle?: string;
  showBack?: boolean;
  /** Override the page background. Default: gradient #eee→#dadada */
  pageBg?: string;
  className?: string;
}

export default function AppShell({
  children,
  topBarTitle,
  showBack = true,
  pageBg,
  className,
}: AppShellProps) {
  return (
    <div
      className="relative min-h-screen w-full"
      style={pageBg ? { background: pageBg, backgroundAttachment: "fixed" } : {}}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:block">
        <Sidebar />
        <TopBar title={topBarTitle} showBack={showBack} />
        {/* Content area: starts after fixed sidebar (327px) and top bar (56px + 12px + 14px gap = 82px) */}
        <main className={cn("absolute top-[82px] left-[327px] w-[calc(100%-339px)] pb-10", className)}>
          {children}
        </main>
      </div>

      {/* ── Mobile ── */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="VedaAI"
              className="size-7 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-[#303030]" style={{ letterSpacing: "-1.2px" }}>
              VedaAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative size-9 flex items-center justify-center bg-[#f6f6f6] rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 10C5 7.23858 7.23858 5 10 5H14C16.7614 5 19 7.23858 19 10V15L20.5 17.5H3.5L5 15V10Z" stroke="#303030" strokeWidth="1.25" strokeLinejoin="round"/>
                <path d="M10 17.5C10 18.6046 10.8954 19.5 12 19.5C13.1046 19.5 14 18.6046 14 17.5" stroke="#303030" strokeWidth="1.25"/>
              </svg>
              <span className="absolute top-[3px] right-[3px] size-2 bg-[#ff5623] rounded-full" />
            </div>
            <div className="size-8 rounded-full bg-[#f6f6f6] flex items-center justify-center text-sm font-semibold text-[#303030]">
              J
            </div>
          </div>
        </header>

        <main className={cn("flex-1 pb-36", className)}>{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
