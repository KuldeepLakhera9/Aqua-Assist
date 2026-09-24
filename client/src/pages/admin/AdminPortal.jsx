import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../../components/Common/ThemeToggle";
import {
  PieChart,
  Users,
  Truck,
  Building2,
  ShieldAlert,
  Banknote,
  CheckCircle,
  BarChart3,
  LogOut,
  UserCircle,
} from "lucide-react";

const AdminPortal = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.some(
      (role) => user.roles?.includes(role) || user.role === role
    );
  };

  const isActive = (path) => {
    if (
      path === "/admin" &&
      (location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard")
    ) {
      return "bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-sky-400 border-r-2 border-primary-600 dark:border-sky-400";
    }

    return location.pathname === path
      ? "bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-sky-400 border-r-2 border-primary-600 dark:border-sky-400"
      : "hover:bg-app-hover text-app-muted hover:text-app-text";
  };

  return (
    <div className="min-h-screen bg-app-base text-app-text flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-app-surface border-r border-app-border h-screen sticky top-0 flex flex-col justify-between transition-colors">
        <div>
          <div className="p-4 border-b border-app-border flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-app-text">Admin Portal</h1>
              <p className="text-xs text-app-muted">National Disaster System</p>
            </div>
            <ThemeToggle className="ml-2" />
          </div>

          <nav className="mt-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                    "/admin"
                  )} font-medium mx-2 transition-colors`}
                >
                  <PieChart className="w-4 h-4 mr-2.5" />
                  Dashboard
                </Link>
              </li>

              {hasAnyRole(["admin"]) && (
                <li>
                  <Link
                    to="/admin/analytics"
                    className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                      "/admin/analytics"
                    )} font-medium mx-2 transition-colors`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2.5" />
                    Advanced Analytics
                  </Link>
                </li>
              )}

              {hasAnyRole(["admin"]) && (
                <li>
                  <Link
                    to="/admin/users"
                    className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                      "/admin/users"
                    )} font-medium mx-2 transition-colors`}
                  >
                    <Users className="w-4 h-4 mr-2.5" />
                    User Management
                  </Link>
                </li>
              )}

              {hasAnyRole(["admin", "municipality"]) && (
                <li>
                  <Link
                    to="/admin/resources"
                    className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                      "/admin/resources"
                    )} font-medium mx-2 transition-colors`}
                  >
                    <Truck className="w-4 h-4 mr-2.5" />
                    Resource Tracking
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/admin/municipality"
                  className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                    "/admin/municipality"
                  )} font-medium mx-2 transition-colors`}
                >
                  <Building2 className="w-4 h-4 mr-2.5" />
                  Municipality Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/rescuer"
                  className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                    "/admin/rescuer"
                  )} font-medium mx-2 transition-colors`}
                >
                  <ShieldAlert className="w-4 h-4 mr-2.5" />
                  Rescuer Dashboard
                </Link>
              </li>

              {hasAnyRole(["admin", "municipality"]) && (
                <li>
                  <Link
                    to="/admin/financial-aid"
                    className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                      "/admin/financial-aid"
                    )} font-medium mx-2 transition-colors`}
                  >
                    <Banknote className="w-4 h-4 mr-2.5" />
                    Financial Aid Requests
                  </Link>
                </li>
              )}

              {hasAnyRole(["admin", "municipality"]) && (
                <li>
                  <Link
                    to="/admin/verification"
                    className={`flex items-center px-4 py-2.5 rounded-md ${isActive(
                      "/admin/verification"
                    )} font-medium mx-2 transition-colors`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2.5" />
                    AI Report Verification
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* User Profile and Logout Section */}
        <div className="p-4 border-t border-app-border bg-app-surface transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <UserCircle className="w-8 h-8 text-app-muted" />
              <div>
                <p className="text-sm font-medium text-app-text truncate max-w-[140px]">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-app-muted capitalize">
                  {user?.role || "admin"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto bg-app-base transition-colors">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPortal;
