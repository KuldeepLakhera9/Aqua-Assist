import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Hook-based wrapper for functional components
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

// Lightweight error boundary for specific use cases
export const SimpleErrorBoundary = ({ children, fallback = null }) => {
  return (
    <ErrorBoundary
      fallback={
        fallback ||
        ((error, retry) => (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="text-xs font-semibold">Component failed to render.</span>
            </div>
            {retry && (
              <button
                onClick={retry}
                className="px-2.5 py-1 text-xs font-medium rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors flex items-center"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </button>
            )}
          </div>
        ))
      }
    >
      {children}
    </ErrorBoundary>
  );
};
