import React, { useState } from 'react';
import { PhoneCall, CheckCircle, XCircle, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EmergencyCallsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const queryClient = useQueryClient();

  const { data: emergencyCalls = [], isLoading } = useQuery({
    queryKey: ['emergencyCalls'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/emergency-calls');
      return response.data;
    }
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['rescueTeams'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/teams');
      return response.data;
    }
  });

  const updateCallStatus = useMutation({
    mutationFn: async ({ callId, data }) => {
      const response = await axios.put(`/api/admin/rescuers/emergency-calls/${callId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emergencyCalls']);
      setIsOpen(false);
      toast.success('Emergency Call Updated');
    }
  });

  const handleStatusUpdate = (call) => {
    setSelectedCall(call);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      status: formData.get('status'),
      assignedTeam: formData.get('assignedTeam'),
      priority: formData.get('priority')
    };

    updateCallStatus.mutate({
      callId: selectedCall._id,
      data: updateData
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      in_progress: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      cancelled: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    };
    const cls = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      medium: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      low: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    };
    const cls = badges[priority] || badges.medium;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="w-full bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden text-app-text transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-app-border">
          <thead className="bg-app-surface">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Caller</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Location</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Assigned Team</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border bg-app-card">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-sm text-app-muted">
                  Loading emergency calls...
                </td>
              </tr>
            ) : emergencyCalls.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-sm text-app-muted">
                  No active emergency distress calls logged.
                </td>
              </tr>
            ) : (
              emergencyCalls.map((call) => (
                <tr key={call._id} className="hover:bg-app-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-app-text">{call.callerName}</p>
                      <p className="text-xs text-app-muted">{call.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-app-text">{call.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-app-muted">
                    {call.timestamp ? format(new Date(call.timestamp), 'MMM d, yyyy HH:mm') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(call.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(call.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-app-muted">
                    {teams.find(team => team._id === call.assignedTeam)?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleStatusUpdate(call)}
                      className="p-1.5 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-sky-400 hover:bg-primary-100 dark:hover:bg-slate-700 transition-colors"
                      title="Update call status"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isOpen && selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-app-card w-full max-w-md rounded-xl border border-app-card-border shadow-xl p-6 text-app-text space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-app-border">
              <h3 className="text-lg font-bold text-app-text">Update Emergency Call</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={selectedCall?.status}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Priority</label>
                <select
                  name="priority"
                  defaultValue={selectedCall?.priority}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Assigned Team</label>
                <select
                  name="assignedTeam"
                  defaultValue={selectedCall?.assignedTeam}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-app-border">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-app-border text-app-text hover:bg-app-hover rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateCallStatus.isLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {updateCallStatus.isLoading ? 'Updating...' : 'Update Call'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmergencyCallsList;