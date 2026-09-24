import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Inbox,
  Loader2,
} from "lucide-react";
import floodReportService from "../../services/floodReportService";

const FloodReportTable = () => {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["floodReports", filter],
    queryFn: async () => {
      const filters = {};
      if (filter !== "all") filters.status = filter;
      return await floodReportService.getAdminFloodReports(filters);
    },
  });

  const reports = useMemo(() => data?.reports || [], [data]);

  const updateReportStatus = useMutation({
    mutationFn: async ({ reportId, status }) => {
      return await floodReportService.updateReportStatus(reportId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["floodReports"]);
    },
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        label: "Pending",
        class:
          "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80",
      },
      verified: {
        icon: CheckCircle,
        label: "Verified",
        class:
          "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80",
      },
      rejected: {
        icon: XCircle,
        label: "Rejected",
        class:
          "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80",
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.class}`}
      >
        <Icon className="w-3.5 h-3.5 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || "").toLowerCase();
    const config = {
      high: {
        label: "Critical",
        class:
          "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80",
      },
      medium: {
        label: "Moderate",
        class:
          "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80",
      },
      low: {
        label: "Minor",
        class:
          "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/80",
      },
    };

    const cfg = config[s] || config.low;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.class}`}
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="bg-app-card shadow-sm rounded-xl border border-app-card-border overflow-hidden text-app-text transition-colors">
      {/* Filters */}
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <div className="flex space-x-2">
          {["all", "pending", "verified", "rejected"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === filterOption
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
        <span className="text-xs text-app-muted font-medium">
          {reports.length} report{reports.length === 1 ? "" : "s"} shown
        </span>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-app-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-sky-400 mb-2" />
          <p className="text-sm">Synchronizing incident queue...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="p-4 rounded-full bg-app-surface border border-app-border text-app-muted mb-3">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-app-text">
            No flood incidents found
          </h3>
          <p className="text-sm text-app-muted max-w-sm mt-1">
            There are currently no reports matching the "{filter}" filter. All
            district telemetry is within safe limits.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card">
              {reports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-app-hover transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-app-text">
                      <MapPin className="w-4 h-4 text-app-muted mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {report.location?.address || "Coordinates Logged"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(report.severity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-app-muted max-w-xs">
                    <p className="truncate">
                      {report.description || "No narrative details provided."}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-app-text">
                    {report.reportedBy?.name || "Anonymous Citizen"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-app-muted">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          updateReportStatus.mutate({
                            reportId: report._id,
                            status: "verified",
                          })
                        }
                        disabled={report.status === "verified"}
                        className="px-2.5 py-1 text-xs font-medium rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() =>
                          updateReportStatus.mutate({
                            reportId: report._id,
                            status: "rejected",
                          })
                        }
                        disabled={report.status === "rejected"}
                        className="px-2.5 py-1 text-xs font-medium rounded text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-300 dark:border-rose-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FloodReportTable;
