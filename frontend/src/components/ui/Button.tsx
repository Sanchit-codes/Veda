"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "dark" | "white" | "orange";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "dark",
      size = "md",
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      dark: "bg-[#181818] text-white border border-white/50 hover:bg-[#2b2b2b]",
      white: "bg-white text-[#303030] hover:bg-[#f0f0f0]",
      orange:
        "bg-[#272727] text-white border-4 border-[#ff7950] shadow-[inset_0px_-1px_3.5px_rgba(177,177,177,0.6),inset_0px_0px_34.5px_rgba(255,255,255,0.25)] hover:bg-[#333]",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-3 text-base tracking-[-0.64px]",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
