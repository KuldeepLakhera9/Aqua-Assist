import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely with Tailwind CSS precedence.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format timestamps according to institutional ISO/government standard
 */
export function formatCrisisTimestamp(date: Date | string | number): string {
  const d = new Date(date);
  return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
}

/**
 * Format numeric values with tabular separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}
