"use client";

import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

export default function TasksErrorBoundaryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
          <h1>Error: {getErrorMessage(error)}</h1>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
