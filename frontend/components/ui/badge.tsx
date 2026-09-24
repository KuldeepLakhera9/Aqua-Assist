import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-slate-800 bg-slate-900 text-white",
        secondary:
          "border-slate-300 bg-slate-100 text-slate-800",
        outline:
          "border-slate-300 bg-white text-slate-700",
        destructive:
          "border-red-300 bg-red-50 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// -------------------------------------------------------------
// OPERATIONAL SEVERITY BADGE
// Strictly pairs Icon + Status Text + WCAG 2.1 AA Contrast Ratio
// Never relies on color alone (accessible for color blindness)
// -------------------------------------------------------------

export type SeverityLevel = "normal" | "advisory" | "high" | "critical";

export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: SeverityLevel;
  label?: string;
  showIcon?: boolean;
}

export function SeverityBadge({
  level,
  label,
  showIcon = true,
  className,
  ...props
}: SeverityBadgeProps) {
  const configs: Record<
    SeverityLevel,
    {
      bg: string;
      text: string;
      border: string;
      defaultLabel: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    normal: {
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      border: "border-emerald-300",
      defaultLabel: "Normal / Low Risk",
      icon: CheckCircle2,
    },
    advisory: {
      bg: "bg-amber-50",
      text: "text-amber-950",
      border: "border-amber-300",
      defaultLabel: "Advisory / Alert",
      icon: Info,
    },
    high: {
      bg: "bg-orange-50",
      text: "text-orange-950",
      border: "border-orange-300",
      defaultLabel: "Severe / High Risk",
      icon: AlertTriangle,
    },
    critical: {
      bg: "bg-red-50",
      text: "text-red-950",
      border: "border-red-400 font-bold",
      defaultLabel: "CRITICAL / EMERGENCY",
      icon: AlertOctagon,
    },
  };

  const config = configs[level] || configs.normal;
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider tabular-nums",
        config.bg,
        config.text,
        config.border,
        className
      )}
      role="status"
      aria-label={`Severity level: ${displayLabel}`}
      {...props}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{displayLabel}</span>
    </div>
  );
}

export { Badge, badgeVariants };
