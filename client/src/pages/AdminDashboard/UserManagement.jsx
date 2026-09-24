import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Edit,
  Trash2,
  UserPlus,
  Search,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "citizen",
  });

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", searchTerm, roleFilter],
    queryFn: () =>
      adminService.getUsers({
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : undefined,
      }),
  });

  const createUserMutation = useMutation({
    mutationFn: (userData) => adminService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setShowCreateModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "citizen",
      });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updates }) =>
      adminService.updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setShowCreateModal(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setShowDeleteModal(null);
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      const updates = { ...formData };
      if (!updates.password) {
        delete updates.password;
      }
      updateUserMutation.mutate({
        userId: editingUser._id,
        updates,
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "citizen",
    });
    setShowCreateModal(true);
  };

  const handleDeleteUser = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  const toggleUserVerification = (user) => {
    updateUserMutation.mutate({
      userId: user._id,
      updates: { isVerified: !user.isVerified },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 text-app-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-sky-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl p-6 m-6 text-app-text">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 mr-2" />
          <h3 className="text-lg font-medium text-rose-800 dark:text-rose-200">
            Error loading users
          </h3>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const users = usersData?.data?.users || usersData?.users || [];

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
      municipality: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-sky-300 dark:border-blue-800",
      official: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      rescuer: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      volunteer: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      citizen: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    };
    const cls = badges[role] || badges.citizen;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-app-text transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-app-text">User Governance</h2>
          <p className="mt-1 text-sm text-app-muted">
            Manage multi-agency users, credentials, and verification statuses.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              password: "",
              role: "citizen",
            });
            setShowCreateModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-app-card p-4 rounded-xl border border-app-card-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-app-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="official">Official</option>
            <option value="municipality">Municipality</option>
            <option value="rescuer">Rescuer</option>
            <option value="admin">Admin</option>
          </select>
          <div className="text-xs font-medium text-app-muted flex items-center justify-end">
            Active Directory: {users.length} registered
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-app-hover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-app-text">
                          {user.name || "N/A"}
                        </div>
                        <div className="text-xs text-app-muted">
                          ID: {user._id ? user._id.slice(-6) : "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-app-text">
                      <div>{user.email}</div>
                      <div className="text-xs text-app-muted">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          user.isVerified
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => toggleUserVerification(user)}
                          className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                          title={
                            user.isVerified
                              ? "Mark as Unverified"
                              : "Verify User"
                          }
                        >
                          {user.isVerified ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(user)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-app-muted"
                  >
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-10 w-10 text-app-muted mb-2" />
                      <p className="text-sm">No users found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-app-card rounded-xl border border-app-card-border p-6 w-full max-w-md shadow-xl text-app-text">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <h3 className="text-lg font-bold text-app-text">
                {editingUser ? "Edit User Record" : "Create New Authority User"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  {editingUser
                    ? "Password (leave blank to keep unchanged)"
                    : "Password"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-app-muted uppercase mb-1">
                  System Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                >
                  <option value="citizen">Citizen</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="rescuer">Rescuer</option>
                  <option value="municipality">Municipality</option>
                  <option value="official">Official</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-app-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium border border-app-border text-app-text rounded-lg hover:bg-app-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createUserMutation.isPending || updateUserMutation.isPending
                  }
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {createUserMutation.isPending || updateUserMutation.isPending
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-app-card rounded-xl border border-app-card-border p-6 w-full max-w-md shadow-xl text-app-text">
            <h3 className="text-lg font-bold text-app-text mb-2">
              Revoke User Account
            </h3>
            <p className="text-sm text-app-muted mb-6">
              Are you sure you want to permanently delete {showDeleteModal.name}? This
              action cannot be reversed.
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t border-app-border">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium border border-app-border text-app-text rounded-lg hover:bg-app-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal._id)}
                disabled={deleteUserMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Revoke Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
