import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconRight?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconRight, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-base font-bold text-[#303030] tracking-[-0.64px]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full h-11 px-4 rounded-full border border-[#dadada] bg-white",
              "text-base font-medium text-[#303030] tracking-[-0.64px]",
              "placeholder:text-[#a9a9a9]",
              "outline-none focus:border-[#303030] transition-colors",
              iconRight && "pr-12",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a9a9a9]">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 tracking-[-0.48px]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
