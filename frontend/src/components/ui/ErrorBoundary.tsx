"use client";

import { ReactNode, useState } from "react";

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
