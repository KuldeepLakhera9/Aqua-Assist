import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, FileText, AlertCircle } from "lucide-react";
import {
  getFinancialAidRequests,
  reviewFinancialAidRequest,
} from "../../services/financialAid";
import { toast } from "react-hot-toast";

const FinancialAidRequests = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewComment, setReviewComment] = useState("");

  const { data: financialAidData, isLoading, error } = useQuery({
    queryKey: ["financialAidRequests"],
    queryFn: getFinancialAidRequests,
  });

  const requests = financialAidData?.data?.requests || [];

  const reviewMutation = useMutation({
    mutationFn: ({ requestId, reviewData }) =>
      reviewFinancialAidRequest(requestId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(["financialAidRequests"]);
      toast.success("Request reviewed successfully");
      setSelectedRequest(null);
      setReviewComment("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to review request");
    },
  });

  const handleReview = (status) => {
    if (!selectedRequest) return;
    reviewMutation.mutate({
      requestId: selectedRequest._id,
      reviewData: { status, reviewComment },
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-app-muted">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-app-text transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Disaster Financial Aid Requests</h1>
        <p className="mt-1 text-sm text-app-muted">
          Review, approve, and disburse relief grant requests for affected citizens
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Requests List */}
        <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-app-border bg-app-surface flex items-center justify-between">
            <h2 className="text-sm font-bold text-app-text uppercase tracking-wider">
              Pending Grant Applications
            </h2>
            <span className="text-xs text-app-muted font-medium">
              {requests.length} total
            </span>
          </div>

          <div className="divide-y divide-app-border">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request._id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedRequest?._id === request._id
                      ? "bg-primary-50/70 dark:bg-primary-950/40 border-l-4 border-primary-600"
                      : "hover:bg-app-hover"
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-app-text text-sm">
                        {request.applicant?.name || "Citizen Applicant"}
                      </p>
                      <p className="text-xs font-medium text-app-muted mt-0.5">
                        Amount Requested:{" "}
                        <strong className="text-app-text font-bold">
                          ₹{request.amountRequested?.toLocaleString() || "0"}
                        </strong>
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <p className="text-xs text-app-muted mt-2 line-clamp-2">
                    {request.reason || "No claim details provided."}
                  </p>

                  <div className="flex items-center text-[11px] text-app-muted mt-3">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Submitted:{" "}
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString()
                      : "Recent"}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-app-muted">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No financial aid requests submitted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Panel */}
        <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm p-6">
          {selectedRequest ? (
            <div className="space-y-4">
              <div className="border-b border-app-border pb-3">
                <h2 className="text-base font-bold text-app-text">Application Review Dossier</h2>
                <p className="text-xs text-app-muted">ID: {selectedRequest._id}</p>
              </div>

              <div className="bg-app-surface rounded-lg p-3 space-y-1.5 text-xs border border-app-border">
                <div className="flex justify-between">
                  <span className="text-app-muted">Applicant:</span>
                  <span className="font-semibold text-app-text">{selectedRequest.applicant?.name || "Citizen"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Contact:</span>
                  <span className="text-app-text">{selectedRequest.applicant?.email || selectedRequest.applicant?.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Requested Sum:</span>
                  <span className="font-bold text-primary-600 dark:text-sky-400">₹{selectedRequest.amountRequested?.toLocaleString() || 0}</span>
                </div>
                <div className="pt-1.5 border-t border-app-border text-app-text">
                  <span className="text-app-muted block mb-0.5">Disaster Damage Report:</span>
                  <p className="leading-relaxed">{selectedRequest.reason || "No justification provided."}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  Adjudication Assessment & Comments
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Record assessment notes, disbursement directives, or rejection rationale..."
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => handleReview("approved")}
                  disabled={reviewMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Relief Aid
                </button>
                <button
                  onClick={() => handleReview("rejected")}
                  disabled={reviewMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-app-muted">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Select an application from the queue to adjudicate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAidRequests;
