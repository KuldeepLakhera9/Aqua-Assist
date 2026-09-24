import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Home,
  FileText,
  AlertTriangle,
  Phone,
  User,
  BarChart3,
  Menu,
  X,
  LogOut,
  MapPin,
  Users,
  ShieldAlert,
  Box,
  Droplet,
  Bell,
  Building2,
  LifeBuoy,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../Common/ThemeToggle";
import LanguageSelector from "../Common/LanguageSelector";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Report Flood", href: "/report-flood", icon: FileText },
    { name: "Report Water Issue", href: "/report-water-issue", icon: Droplet },
    { name: "View Reports", href: "/reports", icon: MapPin },
    { name: "Water Issues", href: "/water-issues", icon: Droplet },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Emergency", href: "/emergency", icon: Phone },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Municipality", href: "/admin/municipality", icon: Building2 },
    { name: "Rescuers", href: "/admin/rescuers", icon: LifeBuoy },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Flood Reports", href: "/admin/reports", icon: ShieldAlert },
    { name: "Water Issues", href: "/admin/water-issues", icon: Droplet },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  const municipalityNavigation = [
    {
      name: "Municipality Dashboard",
      href: "/municipality/dashboard",
      icon: Home,
    },
    { name: "Flood Reports", href: "/municipality/reports", icon: MapPin },
    { name: "Water Issues", href: "/municipality/water-issues", icon: Droplet },
    {
      name: "Manage Alerts",
      href: "/municipality/alerts",
      icon: AlertTriangle,
    },
    {
      name: "Manage Rescuers",
      href: "/municipality/rescuers",
      icon: LifeBuoy,
    },
    { name: "Manage Resources", href: "/municipality/resources", icon: Box },
    { name: "Analytics", href: "/municipality/analytics", icon: BarChart3 },
    { name: "Profile", href: "/municipality/profile", icon: User },
  ];

  let navigation = [];
  if (user?.role === "admin") {
    navigation = adminNavigation;
  } else if (user?.role === "municipality") {
    navigation = municipalityNavigation;
  } else {
    navigation = userNavigation;
  }

  const handleLogout = async () => {
    setSidebarOpen(false);
    // If logout is async, await it; otherwise, just call
    const result = logout();
    if (result instanceof Promise) {
      await result;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-app-base text-app-text transition-colors">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-app-surface shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-app-border">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-app-text tracking-tight">
              Aqua Assists
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-app-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-app-text">{user?.name || "Official User"}</p>
              <p className="text-xs text-app-muted capitalize">
                {user?.role || "citizen"}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
                <span className="text-xs text-app-muted">
                  Trust: {user?.trustScore || 100}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-sky-300 font-semibold border-r-2 border-primary-600 dark:border-primary-400"
                    : "text-app-muted hover:bg-app-hover hover:text-app-text"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-app-muted rounded-lg hover:bg-app-hover hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-app-surface shadow-sm border-b border-app-border transition-colors">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-bold text-app-text">
                  {navigation.find((item) => item.href === location.pathname)
                    ?.name || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <LanguageSelector compact />

              <div className="flex items-center space-x-2">
                <Link
                  to="/emergency"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-semibold rounded-lg text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  Emergency
                </Link>
                <Link
                  to="/emergency-services"
                  className="inline-flex items-center px-3 py-2 border border-app-border text-xs font-semibold rounded-lg text-app-text bg-app-card hover:bg-app-hover shadow-sm transition-colors"
                >
                  <LifeBuoy className="w-3.5 h-3.5 mr-1 text-app-muted" />
                  Services
                </Link>
              </div>

              <Link
                to="/profile"
                className="flex items-center p-1.5 rounded-lg hover:bg-app-hover transition-colors"
              >
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-app-base transition-colors">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
