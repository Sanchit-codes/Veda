"use client";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export default function FileList({ files, onRemove }: FileListProps) {
  return (
    <div className="flex flex-col gap-2">
      {files.map((file, i) => (
        <div
          key={`${file.name}-${i}`}
          className="flex items-center justify-between bg-white rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-8 rounded-lg bg-[#f0f0f0] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 3H13L16 6V17H4V3Z" stroke="#5e5e5e" strokeWidth="1.25" strokeLinejoin="round"/>
                <path d="M12.5 3V6.5H16" stroke="#5e5e5e" strokeWidth="1.25" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-[#303030] tracking-[-0.56px] truncate">
                {file.name}
              </span>
              <span className="text-xs text-[#a9a9a9] tracking-[-0.48px]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="size-6 flex items-center justify-center text-[#a9a9a9] hover:text-[#ff5623] transition-colors cursor-pointer shrink-0"
            aria-label="Remove file"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
