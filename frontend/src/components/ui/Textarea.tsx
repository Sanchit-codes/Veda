import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  iconRight?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, iconRight, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-base font-bold text-[#303030] tracking-[-0.64px]">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "w-full p-4 rounded-2xl border border-dashed border-[#dadada]",
              "bg-white/25 text-sm font-medium text-[#303030] tracking-[-0.56px]",
              "placeholder:text-[rgba(48,48,48,0.6)] resize-none",
              "outline-none focus:border-[#303030] transition-colors",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 bottom-3">{iconRight}</span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
