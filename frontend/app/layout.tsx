import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "National Flood Disaster Management System | Official Portal",
  description:
    "Integrated Crisis Command, Citizen Alerting, Evacuation Tracking, and Relief Administration System.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
        {/* Top Government Institutional Banner */}
        <header className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider uppercase">
              🏛️ Official Government Crisis Portal
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">National Disaster Management Authority</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Telemetry Active
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono">WCAG 2.1 AA Compliant</span>
          </div>
        </header>

        {/* Global Auth Context Provider */}
        <AuthProvider>
          <div className="flex-1 flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
