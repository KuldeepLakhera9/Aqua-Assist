import React, { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const RescueTeamList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['rescueTeams'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/teams');
      return response.data;
    }
  });

  const createTeam = useMutation({
    mutationFn: async (teamData) => {
      const response = await axios.post('/api/admin/rescuers/teams', teamData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rescueTeams']);
      setIsOpen(false);
      toast.success('Team Created');
    }
  });

  const updateTeam = useMutation({
    mutationFn: async ({ teamId, data }) => {
      const response = await axios.put(`/api/admin/rescuers/teams/${teamId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rescueTeams']);
      setIsOpen(false);
      toast.success('Team Updated');
    }
  });

  const deleteTeam = useMutation({
    mutationFn: async (teamId) => {
      await axios.delete(`/api/admin/rescuers/teams/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rescueTeams']);
      toast.success('Team Deleted');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const teamData = {
      name: formData.get('name'),
      leader: formData.get('leader'),
      specialization: formData.get('specialization'),
      status: formData.get('status'),
      capacity: parseInt(formData.get('capacity'), 10) || 5
    };

    if (selectedTeam) {
      updateTeam.mutate({ teamId: selectedTeam._id, data: teamData });
    } else {
      createTeam.mutate(teamData);
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setIsOpen(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      standby: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      unavailable: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    };
    const cls = badges[status] || badges.standby;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full space-y-4 text-app-text transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-app-text">Search & Rescue Squads</h2>
          <p className="text-xs text-app-muted">Manage field teams, leaders, and mobilization capacity.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTeam(null);
            setIsOpen(true);
          }}
          className="inline-flex items-center px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Team
        </button>
      </div>

      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Team Leader</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-app-muted">
                    Loading rescue teams...
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-app-muted">
                    No active rescue teams registered.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team._id} className="hover:bg-app-hover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-app-text">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-app-muted">{team.leader}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-app-text">{team.specialization?.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(team.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-app-muted">{team.capacity || team.members?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(team)}
                          className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                          title="Edit squad"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTeam.mutate(team._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete squad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-app-card w-full max-w-md rounded-xl border border-app-card-border shadow-xl p-6 text-app-text space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-app-border">
              <h3 className="text-lg font-bold text-app-text">
                {selectedTeam ? 'Edit Rescue Squad' : 'Create New Rescue Squad'}
              </h3>
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
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Squad Name</label>
                <input
                  name="name"
                  required
                  defaultValue={selectedTeam?.name}
                  placeholder="e.g. NDRF Alpha Unit"
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Squad Leader</label>
                <input
                  name="leader"
                  required
                  defaultValue={selectedTeam?.leader}
                  placeholder="Enter commander name"
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Specialization</label>
                <select
                  name="specialization"
                  defaultValue={selectedTeam?.specialization || "water_rescue"}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="water_rescue">Water Rescue</option>
                  <option value="medical">Medical Response</option>
                  <option value="evacuation">Evacuation Transport</option>
                  <option value="search_rescue">Search & Rescue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Operational Status</label>
                <select
                  name="status"
                  defaultValue={selectedTeam?.status || "active"}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="standby">Standby</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">Team Capacity</label>
                <input
                  name="capacity"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={selectedTeam?.capacity || 6}
                  className="w-full p-2 bg-app-input border border-app-input-border text-app-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                disabled={createTeam.isLoading || updateTeam.isLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {selectedTeam ? 'Update Squad' : 'Create Squad'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RescueTeamList;