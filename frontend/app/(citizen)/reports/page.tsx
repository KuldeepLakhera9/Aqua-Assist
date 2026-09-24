"use client";

import * as React from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  AlertTriangle,
  Bot,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { reportService, ReportFilterParams } from "@/lib/services/report-service";
import { FloodReport, ReportSeverity, ReportStatus } from "@/types/reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

export default function ReportsFeedPage() {
  const [reports, setReports] = React.useState<FloodReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    const data = await reportService.getReports({
      severity: selectedSeverity as any,
      status: selectedStatus as any,
      search,
    });
    setReports(data.reports);
    setLoading(false);
  }, [selectedSeverity, selectedStatus, search]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await reportService.voteOnReport(id, "up");
    if (res.success) {
      setReports((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id
            ? { ...r, upvotesCount: res.upvotesCount, hasUpvoted: true }
            : r
        )
      );
    }
  };

  const mapSeverityToBadgeLevel = (sev: ReportSeverity) => {
    if (sev === "critical") return "critical";
    if (sev === "high") return "high";
    if (sev === "medium") return "advisory";
    return "normal";
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Active Incident Intelligence & Flood Reports
            </h1>
            <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-xs font-mono">
              PUBLIC LOG
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Verified ground-truth flood inundation reports logged by citizens and municipal sensors.
          </p>
        </div>

        <Link href="/report-flood">
          <Button className="text-xs h-9 font-semibold bg-slate-900 text-white hover:bg-slate-800">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Report New Inundation
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search landmark, street, or municipal ward..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            aria-label="Filter by severity"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical / Emergency</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium / Advisory</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified by Authorities</option>
            <option value="under_review">Under AI Review</option>
            <option value="pending">Awaiting Triage</option>
          </select>
        </div>
      </div>

      {/* Reports Feed List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-mono">
          Loading synchronized incident intelligence feed...
        </div>
      ) : reports.length === 0 ? (
        <div className="py-16 text-center bg-white rounded border border-slate-200 p-8 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Incidents Matching Criteria</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            No active flood reports match your chosen filter. Adjust your search or check official emergency alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const reportId = report._id || report.id || "";
            return (
              <Card
                key={reportId}
                className="border-slate-200 hover:border-slate-300 transition-all overflow-hidden"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Media Thumbnail (if present) */}
                    {report.media && report.media.length > 0 && (
                      <div className="w-full lg:w-44 h-32 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={report.media[0].url}
                          alt="Flood scene evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Report Information */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {report.reportNumber || report._id}
                        </span>
                        <SeverityBadge level={mapSeverityToBadgeLevel(report.severity)} />
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {report.aiVerification?.isVerified && (
                          <Badge
                            variant="outline"
                            className="border-blue-300 bg-blue-50 text-blue-900 text-[10px] font-mono flex items-center gap-1"
                          >
                            <Bot className="h-3 w-3" />
                            AI Verified ({Math.round(report.aiVerification.confidenceScore * 100)}%)
                          </Badge>
                        )}

                        {report.status === "verified" && (
                          <Badge
                            variant="outline"
                            className="border-emerald-300 bg-emerald-50 text-emerald-900 text-[10px] font-mono flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Authority Confirmed
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {report.title || `${report.location.district} Inundation Report`}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {report.description}
                      </p>

                      {/* Location & Depth Telemetry */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            <strong>{report.location.address}</strong>, {report.location.district}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Water Depth: </span>
                          <span className="font-mono font-bold text-slate-900 uppercase">
                            {report.waterLevel} (~{report.depthInMeters || 0.5}m)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Urgency: </span>
                          <span className="font-mono font-bold text-slate-900">
                            {report.urgencyLevel}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Column */}
                    <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <Button
                        type="button"
                        variant={report.hasUpvoted ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => handleUpvote(reportId, e)}
                        className={`text-xs h-8 ${
                          report.hasUpvoted
                            ? "bg-slate-900 text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1.5" />
                        <span>Confirm ({report.upvotesCount})</span>
                      </Button>

                      <Link href={`/reports/${reportId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 text-blue-700 hover:text-blue-900 hover:bg-blue-50 font-semibold"
                        >
                          Full Dossier <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
