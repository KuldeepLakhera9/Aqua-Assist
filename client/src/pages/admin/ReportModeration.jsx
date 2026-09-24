import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import floodReportService from "../../services/floodReportService";
import adminService from "../../services/adminService";

const ReportReviewPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [moderationReason, setModerationReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await floodReportService.getAdminFloodReports();
      const list = data.docs || data.reports || data || [];
      setReports(list);
      setTotalPages(Math.ceil((data.total || list.length || 1) / 10));
    } catch (error) {
      toast.error(error.message || "Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, searchTerm, statusFilter]);

  const handleModeration = async (action) => {
    if (!selectedReport) return;
    try {
      await adminService.moderateReport(
        selectedReport._id,
        action,
        moderationReason
      );
      toast.success(`Report has been ${action === "verify" ? "verified" : "rejected"} successfully`);
      setIsOpen(false);
      setModerationReason("");
      fetchReports();
    } catch (error) {
      toast.error(error.message || "Error moderating report");
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    const badges = {
      pending: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      verified: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      rejected: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    };
    const cls = badges[s] || badges.pending;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {status || "pending"}
      </span>
    );
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (r.verificationStatus || r.status || "pending").toLowerCase() ===
        statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 text-app-text transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Incident Report Moderation</h1>
        <p className="text-sm text-app-muted mt-1">
          Review, verify, and validate citizen-submitted flood incidents and field observations.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-app-card p-4 rounded-xl border border-app-card-border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by address or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs text-app-muted font-medium">Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-app-muted">
                    Loading incident reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-app-muted">
                    No reports matching filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-app-hover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-text">
                      {report.location?.address || "Coordinates Logged"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-app-muted">
                      {report.reportedBy?.name || "Citizen"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.verificationStatus || report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium capitalize text-app-text">
                      {report.severity || "moderate"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsOpen(true);
                        }}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        Moderate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-app-border flex items-center justify-between">
          <p className="text-xs text-app-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-app-border text-app-text hover:bg-app-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-app-border text-app-text hover:bg-app-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Moderation Modal Dialog */}
      {isOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-app-card w-full max-w-lg rounded-xl border border-app-card-border shadow-xl p-6 text-app-text">
            <div className="flex items-center justify-between pb-3 border-b border-app-border">
              <h3 className="text-lg font-bold text-app-text">Moderate Incident Report</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-app-muted uppercase">Location:</span>
                <p className="text-app-text font-medium">{selectedReport.location?.address || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-app-muted uppercase">Reporter:</span>
                <p className="text-app-text">{selectedReport.reportedBy?.name || "Citizen"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-app-muted uppercase">Description:</span>
                <p className="text-app-text bg-app-surface p-3 rounded-lg border border-app-border">
                  {selectedReport.description || "No description provided."}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-app-muted uppercase block mb-1">
                  Moderation Rationale / Audit Notes:
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter reason for verification or rejection..."
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  className="w-full p-2.5 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-3 border-t border-app-border">
              <button
                onClick={() => handleModeration("verify")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Verify Report
              </button>
              <button
                onClick={() => handleModeration("reject")}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reject Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportReviewPage;
