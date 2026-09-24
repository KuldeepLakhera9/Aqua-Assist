"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  Bot,
  AlertTriangle,
  User,
  Share2,
  PhoneCall,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { reportService } from "@/lib/services/report-service";
import { FloodReport, ReportSeverity } from "@/types/reports";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const [report, setReport] = React.useState<FloodReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      if (!reportId) return;
      try {
        setLoading(true);
        const data = await reportService.getReportById(reportId);
        setReport(data);
      } catch (err: any) {
        setError(err.message || "Failed to load report dossier.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reportId]);

  const handleVote = async () => {
    if (!report) return;
    const res = await reportService.voteOnReport(report._id || report.id || reportId, "up");
    if (res.success) {
      setReport((prev) => prev ? { ...prev, upvotesCount: res.upvotesCount, hasUpvoted: true } : null);
    }
  };

  const mapSeverityToBadgeLevel = (sev: ReportSeverity) => {
    if (sev === "critical") return "critical";
    if (sev === "high") return "high";
    if (sev === "medium") return "advisory";
    return "normal";
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500 font-mono">
        Loading authenticated incident dossier #{reportId}...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Incident Dossier Not Found</h2>
        <p className="text-xs text-slate-600">{error || "The requested incident report cannot be retrieved."}</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/reports")}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Reports Log
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/reports"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Reports Log
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          REF: {report.reportNumber || report._id}
        </span>
      </div>

      {/* Main Dossier Header Card */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">
                {report.reportNumber || report._id}
              </span>
              <SeverityBadge level={mapSeverityToBadgeLevel(report.severity)} />
              {report.status === "verified" ? (
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-mono">
                  Official Verification Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono">
                  Pending Field Verification
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-slate-300"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Flood Incident ${report.reportNumber}`,
                    text: report.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Incident URL copied to clipboard.");
                }
              }}
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share Incident Link
            </Button>
          </div>

          <CardTitle className="text-xl font-bold text-slate-900 mt-3">
            {report.title || `${report.location.district} Inundation Incident`}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 font-mono mt-1">
            Logged on {new Date(report.createdAt).toLocaleString()} • Incident ID: {report._id}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Water Depth</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {report.waterLevel}
              </span>
              <span className="text-[11px] text-slate-500 block">~{report.depthInMeters || 0.5} meters</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Triage Urgency</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {report.urgencyLevel} / 10
              </span>
              <span className="text-[11px] text-slate-500 block">Priority Rank</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">GPS Coordinates</span>
              <span className="font-mono font-semibold text-slate-900 text-xs truncate block">
                {report.location.coordinates[1]}°N, {report.location.coordinates[0]}°E
              </span>
              <span className="text-[11px] text-slate-500 block">WGS-84 Datum</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Citizen Confirmations</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {report.upvotesCount} Verified
              </span>
              <span className="text-[11px] text-slate-500 block">Crowd Consensus</span>
            </div>
          </div>

          {/* Location Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Incident Location</h4>
            <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-700" />
                {report.location.address}
              </p>
              {report.location.landmark && (
                <p className="text-slate-600">Landmark: {report.location.landmark}</p>
              )}
              <p className="text-slate-500">
                District: <strong>{report.location.district}</strong> • State: {report.location.state}
              </p>
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Situation Report</h4>
            <div className="p-4 bg-white border border-slate-200 rounded text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {report.description}
            </div>
          </div>

          {/* AI Verification Section */}
          {report.aiVerification && (
            <div className="space-y-2 p-4 rounded border border-blue-200 bg-blue-50/50 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-blue-700" />
                  Multimodal AI Hazard Assessment
                </span>
                <Badge variant="outline" className="border-blue-400 bg-blue-100 text-blue-900 text-[10px] font-mono">
                  Confidence: {Math.round(report.aiVerification.confidenceScore * 100)}%
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Computer vision models validated flood height contours and road boundary submersion.
              </p>
              {report.aiVerification.detectedHazards && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.aiVerification.detectedHazards.map((h, i) => (
                    <Badge key={i} variant="outline" className="border-slate-300 bg-white text-slate-800 text-[10px]">
                      {h}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Media Evidence Gallery */}
          {report.media && report.media.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                Photographic Evidence ({report.media.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.media.map((media, idx) => (
                  <div key={idx} className="rounded border border-slate-200 overflow-hidden bg-slate-100 h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Authority Audit Ledger */}
          {report.verifiedBy && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Authority Verification Record:</strong> Verified by{" "}
                <strong>{report.verifiedBy.name}</strong> ({report.verifiedBy.role}, {report.verifiedBy.agency}). Ground units have acknowledged this hazard profile.
              </div>
            </div>
          )}

          {/* Citizen Community Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-600">
              Are you near this sector? Help authorities verify conditions.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={report.hasUpvoted ? "default" : "outline"}
                size="sm"
                onClick={handleVote}
                className="text-xs w-full sm:w-auto"
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                {report.hasUpvoted ? "You Confirmed This Incident" : `Confirm Accuracy (${report.upvotesCount})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
