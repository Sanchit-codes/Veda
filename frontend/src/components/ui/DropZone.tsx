"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
}

export default function DropZone({
  onFiles,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = true,
  maxSizeMB = 50,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setError(null);
      const arr = Array.from(files);
      const tooBig = arr.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (tooBig) {
        setError(`${tooBig.name} exceeds ${maxSizeMB}MB limit`);
        return;
      }
      onFiles(arr);
    },
    [onFiles, maxSizeMB]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-4 px-8 py-6",
          "bg-white border-[1.75px] border-dashed rounded-3xl cursor-pointer",
          "transition-colors",
          isDragging
            ? "border-[#ff5623] bg-orange-50"
            : "border-[rgba(0,0,0,0.2)] hover:border-[#303030]"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex items-center justify-center bg-white rounded-lg size-10 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#303030]">
            <path d="M12 16V4M7 9L12 4L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 16.5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="text-base font-medium text-[#303030] tracking-[-0.64px]">
            Choose a file or drag &amp; drop it here
          </p>
          <p className="text-sm text-[#a9a9a9] tracking-[-0.56px]">
            PDF, JPEG, PNG, up to {maxSizeMB}MB
          </p>
        </div>
        <span className="px-6 py-2 bg-[#f6f6f6] rounded-full text-sm font-medium text-[#303030] tracking-[-0.56px]">
          Browse Files
        </span>
      </label>
      {error && (
        <p className="text-sm text-red-500 tracking-[-0.48px]">{error}</p>
      )}
    </div>
  );
}
