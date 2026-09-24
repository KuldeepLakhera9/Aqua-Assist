import React, { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AssignmentManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const queryClient = useQueryClient();

  const onClose = () => {
    setIsOpen(false);
    setSelectedAssignment(null);
  };
  const onOpen = () => setIsOpen(true);

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/assignments');
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

  const createAssignment = useMutation({
    mutationFn: async (assignmentData) => {
      const response = await axios.post('/api/admin/rescuers/assignments', assignmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
      onClose();
      toast.success('Assignment Created');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create assignment');
    }
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ assignmentId, data }) => {
      const response = await axios.put(`/api/admin/rescuers/assignments/${assignmentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
      onClose();
      toast.success('Assignment Updated');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update assignment');
    }
  });

  const deleteAssignment = useMutation({
    mutationFn: async (assignmentId) => {
      await axios.delete(`/api/admin/rescuers/assignments/${assignmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
      toast.success('Assignment Deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete assignment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assignmentData = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      assignedTeam: formData.get('assignedTeam'),
      location: formData.get('location'),
      requiredSpecializations: (formData.get('requiredSpecializations') || '').split(',').map(s => s.trim()).filter(Boolean)
    };

    if (selectedAssignment) {
      updateAssignment.mutate({ assignmentId: selectedAssignment._id, data: assignmentData });
    } else {
      createAssignment.mutate(assignmentData);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    onOpen();
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
          High
        </span>
      );
    }
    if (p === 'medium') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
        Low
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          Completed
        </span>
      );
    }
    if (s === 'in_progress') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="space-y-4 text-app-text">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-app-text">Assignment Operations</h3>
          <p className="text-xs text-app-muted">Dispatch and track team assignments</p>
        </div>
        <button
          onClick={() => {
            setSelectedAssignment(null);
            onOpen();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Assigned Team</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card text-sm">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <tr key={assignment._id} className="hover:bg-app-hover transition-colors">
                    <td className="px-5 py-3.5 font-medium text-app-text">{assignment.title}</td>
                    <td className="px-5 py-3.5">{getPriorityBadge(assignment.priority)}</td>
                    <td className="px-5 py-3.5">{getStatusBadge(assignment.status)}</td>
                    <td className="px-5 py-3.5 text-app-muted">{teams.find((team) => team._id === assignment.assignedTeam)?.name || 'Unassigned'}</td>
                    <td className="px-5 py-3.5 text-app-muted">{assignment.location}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                          title="Edit assignment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAssignment.mutate(assignment._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-sm text-app-muted">
                    {isLoading ? 'Loading assignments...' : 'No assignments recorded.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-app-card rounded-xl border border-app-card-border p-6 w-full max-w-lg shadow-xl text-app-text">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <h3 className="text-base font-bold text-app-text">
                {selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Title</label>
                <input
                  name="title"
                  required
                  defaultValue={selectedAssignment?.title}
                  placeholder="Enter assignment title"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={selectedAssignment?.description}
                  placeholder="Enter assignment details"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={selectedAssignment?.priority || 'medium'}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedAssignment?.status || 'pending'}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Assigned Team</label>
                <select
                  name="assignedTeam"
                  defaultValue={selectedAssignment?.assignedTeam || ''}
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Location</label>
                <input
                  name="location"
                  required
                  defaultValue={selectedAssignment?.location}
                  placeholder="Enter operational sector / coordinates"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Required Specializations</label>
                <input
                  name="requiredSpecializations"
                  defaultValue={selectedAssignment?.requiredSpecializations?.join(', ')}
                  placeholder="e.g. Flood Rescue, Paramedic, Diver"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-app-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-app-muted hover:text-app-text bg-app-surface border border-app-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAssignment.isPending || updateAssignment.isPending}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  {createAssignment.isPending || updateAssignment.isPending
                    ? 'Saving...'
                    : selectedAssignment
                    ? 'Update Assignment'
                    : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManager;