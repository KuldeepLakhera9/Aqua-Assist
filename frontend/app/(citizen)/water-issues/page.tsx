"use client";

import * as React from "react";
import {
  Droplet,
  PlusCircle,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertTriangle,
  Building,
  Wrench,
  Loader2,
  MapPin,
} from "lucide-react";
import { waterIssueService } from "@/lib/services/water-issue-service";
import { WaterIssue, WaterIssueCategory, WaterIssueStatus } from "@/types/water-issues";
import { StatMetric } from "@/components/ui/stat-metric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CATEGORY_LABELS: Record<WaterIssueCategory, string> = {
  drainage_overflow: "Drainage Overflow",
  clogged_drain: "Clogged Storm Drain",
  sewage_backflow: "Sewage Backflow",
  drinking_water_contamination: "Potable Water Contamination",
  pipeline_burst: "Pipeline Rupture",
  submerged_transformer: "Submerged Power Plinth",
  stagnant_water: "Stagnant Water Vector Risk",
};

export default function WaterIssuesPage() {
  const [issues, setIssues] = React.useState<WaterIssue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // New Issue Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<WaterIssueCategory>("clogged_drain");
  const [newSeverity, setNewSeverity] = React.useState<"low" | "medium" | "high" | "critical">("high");
  const [newDistrict, setNewDistrict] = React.useState("Mumbai Suburban");
  const [newWard, setNewWard] = React.useState("Ward L");
  const [newAddress, setNewAddress] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");

  const loadIssues = React.useCallback(async () => {
    setLoading(true);
    const data = await waterIssueService.getIssues({
      category: categoryFilter,
      status: statusFilter,
      search,
    });
    setIssues(data);
    setLoading(false);
  }, [categoryFilter, statusFilter, search]);

  React.useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const handleVote = async (id: string) => {
    const res = await waterIssueService.voteOnIssue(id);
    if (res.success) {
      setIssues((prev) =>
        prev.map((i) =>
          i._id === id || i.id === id
            ? { ...i, upvotesCount: res.upvotesCount, hasUpvoted: true }
            : i
        )
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAddress || !newDescription) return;

    setSubmitting(true);
    try {
      const res = await waterIssueService.submitIssue({
        title: newTitle,
        category: newCategory,
        severity: newSeverity,
        description: newDescription,
        location: {
          district: newDistrict,
          ward: newWard,
          address: newAddress,
        },
      });

      if (res.success) {
        setIsDialogOpen(false);
        setNewTitle("");
        setNewAddress("");
        setNewDescription("");
        loadIssues();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Municipal Drainage & Water Contamination Tracker
            </h1>
            <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-xs font-mono">
              CIVIC OPS
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Track and report clogged storm sewers, sewage backflow, pipeline ruptures, and drinking water safety alerts.
          </p>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="text-xs h-9 font-semibold bg-slate-900 text-white hover:bg-slate-800"
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
          Report Drainage Issue
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          label="Active Blockages Reported"
          value="18"
          unit="points"
          icon={Droplet}
          trend={{ direction: "up", value: "+4 this morning", isAdverse: true }}
          helperText="Priority clearing underway"
        />
        <StatMetric
          label="Potable Water Advisories"
          value="2"
          unit="wards"
          icon={AlertTriangle}
          trend={{ direction: "neutral", value: "Bhandup & Kurla" }}
          helperText="Boil orders in effect"
        />
        <StatMetric
          label="Municipal Crews Deployed"
          value="14"
          unit="teams"
          icon={Wrench}
          trend={{ direction: "up", value: "Jetting machines active" }}
          helperText="Suction tankers dispatched"
        />
        <StatMetric
          label="Median Resolution Time"
          value="3.8"
          unit="hours"
          icon={Clock}
          trend={{ direction: "down", value: "-45m vs last monsoon" }}
          helperText="Target: < 4.0 hours"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
        <div className="md:col-span-2 relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by street, ward, or hazard description..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            aria-label="Filter by category"
          >
            <option value="all">All Issue Categories</option>
            <option value="clogged_drain">Clogged Storm Drain</option>
            <option value="drainage_overflow">Drainage Overflow</option>
            <option value="sewage_backflow">Sewage Backflow</option>
            <option value="drinking_water_contamination">Drinking Water Contamination</option>
            <option value="submerged_transformer">Submerged Electrical Plinth</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported (Awaiting Triage)</option>
            <option value="acknowledged">Acknowledged by Ward</option>
            <option value="in_progress">Remediation in Progress</option>
            <option value="resolved">Resolved & Cleared</option>
          </select>
        </div>
      </div>

      {/* Issues Feed List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-mono">
          Loading municipal drainage remediation log...
        </div>
      ) : issues.length === 0 ? (
        <div className="py-16 text-center bg-white rounded border border-slate-200 p-8 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Drainage Issues Found</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            No open water issues match your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => {
            const issueId = issue._id || issue.id || "";
            return (
              <Card key={issueId} className="border-slate-200 hover:border-slate-300 transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {issueId}
                        </span>
                        <Badge variant="outline" className="border-slate-300 bg-slate-100 text-slate-800 text-[10px] font-mono">
                          {CATEGORY_LABELS[issue.category] || issue.category}
                        </Badge>
                        <SeverityBadge
                          level={
                            issue.severity === "critical"
                              ? "critical"
                              : issue.severity === "high"
                              ? "high"
                              : "advisory"
                          }
                        />
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(issue.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {issue.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            <strong>{issue.location.address}</strong>
                            {issue.location.ward && ` (${issue.location.ward})`}
                          </span>
                        </div>
                        {issue.assignedTeam && (
                          <div className="flex items-center gap-1 text-slate-700">
                            <Wrench className="h-3 w-3 text-blue-600" />
                            <span>Assigned: <strong>{issue.assignedTeam}</strong></span>
                          </div>
                        )}
                      </div>

                      {issue.actionTaken && (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-950 font-mono mt-2">
                          <strong>Municipal Action:</strong> {issue.actionTaken}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <Button
                        type="button"
                        variant={issue.hasUpvoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(issueId)}
                        className={`text-xs h-8 ${
                          issue.hasUpvoted
                            ? "bg-slate-900 text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1.5" />
                        <span>Confirm Impact ({issue.upvotesCount})</span>
                      </Button>

                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono ${
                          issue.status === "resolved"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : issue.status === "in_progress"
                            ? "border-blue-300 bg-blue-50 text-blue-800"
                            : "border-amber-300 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {issue.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Drainage Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Report Drainage Obstruction or Water Contamination
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Dispatches incident tickets directly to the Municipal Drainage and Hydraulic Engineering Command.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="issue-title" className="text-xs font-semibold text-slate-800">
                Brief Headline <span className="text-red-600">*</span>
              </Label>
              <Input
                id="issue-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Manhole overflow blocking pedestrian footbridge"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="issue-category" className="text-xs font-semibold text-slate-800">
                  Category
                </Label>
                <select
                  id="issue-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as WaterIssueCategory)}
                  className="w-full h-9 rounded-sm border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="clogged_drain">Clogged Storm Drain</option>
                  <option value="drainage_overflow">Drainage Overflow</option>
                  <option value="sewage_backflow">Sewage Backflow</option>
                  <option value="drinking_water_contamination">Potable Water Contamination</option>
                  <option value="submerged_transformer">Submerged Electrical Plinth</option>
                  <option value="pipeline_burst">Pipeline Burst</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue-severity" className="text-xs font-semibold text-slate-800">
                  Severity
                </Label>
                <select
                  id="issue-severity"
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full h-9 rounded-sm border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical / Severe Risk</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="issue-district" className="text-xs font-semibold text-slate-800">
                  District
                </Label>
                <Input
                  id="issue-district"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue-ward" className="text-xs font-semibold text-slate-800">
                  Ward Code
                </Label>
                <Input
                  id="issue-ward"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                  placeholder="e.g. Ward H/East"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue-address" className="text-xs font-semibold text-slate-800">
                Street Address / Location <span className="text-red-600">*</span>
              </Label>
              <Input
                id="issue-address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="e.g. Near SV Road Junction, Opposite Municipal School"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue-desc" className="text-xs font-semibold text-slate-800">
                Detailed Hazard Description <span className="text-red-600">*</span>
              </Label>
              <textarea
                id="issue-desc"
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Provide observations regarding water color, smell, debris type, or immediate risk..."
                required
                className="w-full rounded-sm border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="text-xs font-semibold bg-slate-900 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                    Dispatching Ticket...
                  </>
                ) : (
                  "Submit Civic Ticket"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
