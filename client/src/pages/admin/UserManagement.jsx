import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, UserCheck, Shield } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import { useAuthStore } from "../../store/authStore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { updateRole } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (roleFilter !== "all") filters.role = roleFilter;

      const response = await adminService.getUsers(page, 10, filters);
      setUsers(response.users || []);
      setTotalPages(Math.ceil((response.total || 1) / 10));
    } catch (error) {
      toast.error(error.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole(userId, newRole);
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Error updating user role");
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      municipality: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-sky-300 border-blue-300 dark:border-blue-800",
      official: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
      rescuer: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      volunteer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      citizen: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    };
    const cls = badges[role] || badges.citizen;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6 text-app-text transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-app-text">User Management</h1>
        <p className="text-sm text-app-muted mt-1">
          Manage system accounts, authority privileges, and multi-agency roles.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-app-card p-4 rounded-xl border border-app-card-border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs text-app-muted font-medium">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-app-input border border-app-input-border text-app-text text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="municipality">Municipality</option>
            <option value="rescuer">Rescuer</option>
            <option value="official">Official</option>
            <option value="volunteer">Volunteer</option>
            <option value="citizen">Citizen</option>
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
                  Name
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Trust Score
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Assign Privilege
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-app-muted">
                    Loading users directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-app-muted">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-app-hover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-text">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-app-muted">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-app-text">
                      {u.trustScore || 100}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2.5 py-1 text-xs bg-app-input border border-app-input-border text-app-text rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="rescuer">Rescuer</option>
                        <option value="municipality">Municipality</option>
                        <option value="official">Official</option>
                        <option value="admin">Admin</option>
                      </select>
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
    </div>
  );
};

export default UserManagement;