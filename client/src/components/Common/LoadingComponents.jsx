import React from "react";
import { Loader2 } from "lucide-react";

// Basic loading spinner
export const LoadingSpinner = ({
  size = "md",
  message = "Loading...",
  showMessage = true,
}) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  const sizeCls = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3 text-app-muted">
      <Loader2 className={`${sizeCls} animate-spin text-primary-600 dark:text-sky-400`} />
      {showMessage && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};

// Full page / container loading overlay
export const LoadingOverlay = ({
  isVisible,
  message = "Loading...",
  backdrop = true,
  children,
}) => {
  if (!isVisible) return children;

  return (
    <div className="relative">
      {children}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center ${
          backdrop ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs" : "bg-transparent"
        }`}
      >
        <div className="flex flex-col items-center space-y-2 text-app-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-sky-400" />
          <p className="text-sm font-medium text-app-text">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Card loading skeleton
export const CardSkeleton = ({
  lines = 3,
  showAvatar = false,
  height = "auto",
}) => (
  <div
    style={{ height }}
    className="p-4 rounded-xl border border-app-card-border bg-app-card shadow-sm space-y-3 animate-pulse"
  >
    {showAvatar && (
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    )}
    <div className="space-y-2 pt-1">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-3.5 rounded bg-slate-200 dark:bg-slate-700 ${
            i === lines - 1 ? "w-3/5" : "w-full"
          }`}
        />
      ))}
    </div>
  </div>
);

// List loading skeleton
export const ListSkeleton = ({
  items = 3,
  showAvatar = true,
}) => (
  <div className="space-y-2.5">
    {Array.from({ length: items }, (_, index) => (
      <div
        key={index}
        className="p-3.5 rounded-lg border border-app-border bg-app-card flex items-center space-x-3 animate-pulse"
      >
        {showAvatar && (
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
        )}
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    ))}
  </div>
);

// Map loading placeholder
export const MapSkeleton = ({ height = "400px" }) => (
  <div
    style={{ height }}
    className="w-full bg-app-surface border border-app-border rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
  >
    <div className="flex flex-col items-center space-y-2 text-app-muted z-10">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-sky-400" />
      <p className="text-sm font-medium">Synchronizing GIS Map Telemetry...</p>
    </div>
  </div>
);

// Chart/Graph loading placeholder
export const ChartSkeleton = ({ height = "300px" }) => (
  <div
    style={{ height }}
    className="p-4 rounded-xl border border-app-card-border bg-app-card flex flex-col justify-between animate-pulse"
  >
    <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700 mb-4" />
    <div className="flex-1 flex items-end justify-between space-x-2 pt-4">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className="w-8 rounded-t bg-slate-200 dark:bg-slate-700"
          style={{ height: `${(index * 13 + 30) % 80 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

// Button loading state
export const LoadingButton = ({
  isLoading,
  children,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  ...props
}) => (
  <button
    {...props}
    disabled={isLoading || disabled}
    className={`${className} ${
      isLoading ? "opacity-75 cursor-not-allowed" : ""
    }`}
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        {loadingText}
      </span>
    ) : (
      children
    )}
  </button>
);

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, showHeader = true }) => (
  <div className="border border-app-card-border rounded-xl bg-app-card overflow-hidden animate-pulse">
    {showHeader && (
      <div className="p-4 border-b border-app-border bg-app-surface flex justify-between">
        {Array.from({ length: columns }, (_, index) => (
          <div key={index} className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
    )}
    <div className="divide-y divide-app-border">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex justify-between items-center">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={colIndex}
              className={`h-3.5 rounded bg-slate-200 dark:bg-slate-700 ${
                colIndex === 0 ? "w-28" : "w-16"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Inline loading state for small components
export const InlineLoader = ({ size = 16, className = "" }) => (
  <Loader2
    style={{ width: size, height: size }}
    className={`animate-spin text-primary-600 dark:text-sky-400 ${className}`}
  />
);

export default {
  LoadingSpinner,
  LoadingOverlay,
  CardSkeleton,
  ListSkeleton,
  MapSkeleton,
  ChartSkeleton,
  LoadingButton,
  TableSkeleton,
  InlineLoader,
};
