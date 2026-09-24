import React, { useState } from 'react';
import { Edit2, Trash2, UserPlus, X, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TeamMemberManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const queryClient = useQueryClient();

  const onClose = () => {
    setIsOpen(false);
    setSelectedMember(null);
  };
  const onOpen = () => setIsOpen(true);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/members');
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

  const createMember = useMutation({
    mutationFn: async (memberData) => {
      const response = await axios.post('/api/admin/rescuers/members', memberData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers']);
      onClose();
      toast.success('Team Member Added');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add member');
    }
  });

  const updateMember = useMutation({
    mutationFn: async ({ memberId, data }) => {
      const response = await axios.put(`/api/admin/rescuers/members/${memberId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers']);
      onClose();
      toast.success('Team Member Updated');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update member');
    }
  });

  const deleteMember = useMutation({
    mutationFn: async (memberId) => {
      await axios.delete(`/api/admin/rescuers/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers']);
      toast.success('Team Member Removed');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete member');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memberData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      role: formData.get('role'),
      team: formData.get('team'),
      specializations: (formData.get('specializations') || '').split(',').map(s => s.trim()).filter(Boolean),
      certifications: (formData.get('certifications') || '').split(',').map(s => s.trim()).filter(Boolean),
      status: formData.get('status')
    };

    if (selectedMember) {
      updateMember.mutate({ memberId: selectedMember._id, data: memberData });
    } else {
      createMember.mutate(memberData);
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    onOpen();
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          Active
        </span>
      );
    }
    if (s === 'on_leave') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
          On Leave
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-4 text-app-text">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-app-text">Personnel Directory</h3>
          <p className="text-xs text-app-muted">Certified field operatives and response team rosters</p>
        </div>
        <button
          onClick={() => {
            setSelectedMember(null);
            onOpen();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Member</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Team</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Specializations</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card text-sm">
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member._id} className="hover:bg-app-hover transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {member.name ? member.name.charAt(0) : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-app-text">{member.name}</div>
                          <div className="text-xs text-app-muted">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-app-text">{member.role}</td>
                    <td className="px-5 py-3.5 text-app-muted">{teams.find((team) => team._id === member.team)?.name || 'Unassigned'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(member.specializations || []).map((spec, index) => (
                          <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(member.status)}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                          title="Edit member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMember.mutate(member._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete member"
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
                    {isLoading ? 'Loading personnel roster...' : 'No personnel registered.'}
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
                {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Full Name</label>
                <input
                  name="name"
                  required
                  defaultValue={selectedMember?.name}
                  placeholder="Enter operative name"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={selectedMember?.email}
                    placeholder="operative@floodcorps.org"
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    defaultValue={selectedMember?.phone}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Role</label>
                  <select
                    name="role"
                    defaultValue={selectedMember?.role || 'rescuer'}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="team_leader">Team Leader</option>
                    <option value="rescuer">Rescuer</option>
                    <option value="medic">Medic</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Assigned Team</label>
                  <select
                    name="team"
                    defaultValue={selectedMember?.team || ''}
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
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Specializations</label>
                <input
                  name="specializations"
                  defaultValue={selectedMember?.specializations?.join(', ')}
                  placeholder="Swift Water Rescue, First Aid, Boat Pilot"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Certifications</label>
                <input
                  name="certifications"
                  defaultValue={selectedMember?.certifications?.join(', ')}
                  placeholder="NDRF Grade II, BLS Certification"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={selectedMember?.status || 'active'}
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-app-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-app-muted hover:text-app-text bg-app-surface border border-app-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMember.isPending || updateMember.isPending}
                  className="px-4 py-2 font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  {createMember.isPending || updateMember.isPending
                    ? 'Saving...'
                    : selectedMember
                    ? 'Update Member'
                    : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberManager;