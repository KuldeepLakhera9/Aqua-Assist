import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  helperText?: string;
  badge?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    isAdverse?: boolean; // In crisis management, "up" (e.g. rising casualties/water level) is adverse!
  };
}

export function StatMetric({
  label,
  value,
  unit,
  helperText,
  badge,
  icon: Icon,
  trend,
  className,
  ...props
}: StatMetricProps) {
  return (
    <Card className={cn("overflow-hidden border border-slate-200 bg-white", className)} {...props}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {label}
          </span>
          {badge && <div className="shrink-0">{badge}</div>}
          {!badge && Icon && (
            <Icon className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-500 uppercase">
              {unit}
            </span>
          )}
        </div>

        {(helperText || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
            {trend && (
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  trend.isAdverse
                    ? "text-red-700"
                    : trend.direction === "neutral"
                    ? "text-slate-600"
                    : "text-emerald-700"
                )}
              >
                {trend.direction === "up" ? "▲ " : trend.direction === "down" ? "▼ " : "● "}
                {trend.value}
              </span>
            )}
            {helperText && <span className="truncate">{helperText}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
