import React from "react";
import FloodReportTable from "../../components/Admin/FloodReportTable";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BarChart3,
  ShieldAlert,
  Truck,
  Banknote,
  CheckCircle,
  Building2,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions.",
      icon: Users,
      route: "/admin/users",
    },
    {
      title: "Advanced Analytics",
      description:
        "View system performance, flood data trends, and user activity.",
      icon: BarChart3,
      route: "/admin/analytics",
    },
    {
      title: "Resource Tracking",
      description: "Monitor and manage emergency resources and equipment.",
      icon: Truck,
      route: "/admin/resources",
    },
    {
      title: "Municipality Dashboard",
      description: "Manage municipality data and municipal services.",
      icon: Building2,
      route: "/admin/municipality",
    },
    {
      title: "Rescuer Dashboard",
      description: "Coordinate rescue teams and emergency response.",
      icon: ShieldAlert,
      route: "/admin/rescuer",
    },
    {
      title: "Financial Aid Requests",
      description: "Review and manage financial assistance applications.",
      icon: Banknote,
      route: "/admin/financial-aid",
    },
    {
      title: "AI Report Verification",
      description:
        "Review AI-verified reports and adjust verification settings.",
      icon: CheckCircle,
      route: "/admin/verification",
    },
  ];

  return (
    <div className="w-full text-app-text transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-text">Admin Dashboard</h1>
        <p className="mt-2 text-app-muted">
          State disaster administration situation room. Manage users, allocate
          tactical resources, and monitor verified crisis telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              className="bg-app-card p-6 rounded-xl shadow-sm border border-app-card-border hover:border-primary-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-app-surface border border-app-border text-primary-600 dark:text-sky-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-app-text">
                  {card.title}
                </h2>
                <p className="text-app-muted mb-6 text-sm">{card.description}</p>
              </div>
              <button
                onClick={() => navigate(card.route)}
                className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Access {card.title}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-app-card p-6 rounded-xl shadow-sm border border-app-card-border">
          <h3 className="text-sm font-medium text-app-muted mb-2">
            Active Users
          </h3>
          <p className="text-3xl font-bold text-app-text">1,234</p>
          <p className="text-xs text-app-muted mt-1">+12% from last month</p>
        </div>
        <div className="bg-app-card p-6 rounded-xl shadow-sm border border-app-card-border">
          <h3 className="text-sm font-medium text-app-muted mb-2">
            Active Flood Alerts
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">5</p>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 font-medium">2 critical danger zones</p>
        </div>
        <div className="bg-app-card p-6 rounded-xl shadow-sm border border-app-card-border">
          <h3 className="text-sm font-medium text-app-muted mb-2">
            Reports Processed Today
          </h3>
          <p className="text-3xl font-bold text-app-text">23</p>
          <p className="text-xs text-app-muted mt-1">18 verified by AI</p>
        </div>
        <div className="bg-app-card p-6 rounded-xl shadow-sm border border-app-card-border">
          <h3 className="text-sm font-medium text-app-muted mb-2">
            Rescue Velocity
          </h3>
          <p className="text-3xl font-bold text-app-text">8m</p>
          <p className="text-xs text-app-muted mt-1">Mean response dispatch</p>
        </div>
      </div>

      {/* Flood Reports Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-app-text mb-4">Flood Incident Queue</h2>
        <FloodReportTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
