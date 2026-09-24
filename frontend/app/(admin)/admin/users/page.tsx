"use client";

import * as React from "react";
import {
  Users,
  UserCheck,
  Shield,
  Search,
  Filter,
  Plus,
  Key,
  Building,
  Radio,
  CheckCircle2,
  Lock,
  Mail,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "municipality" | "rescuer" | "citizen";
  jurisdiction: string;
  status: "active" | "suspended";
  lastLogin: string;
  mfaEnabled: boolean;
}

const SYSTEM_USERS_ROSTER: SystemUser[] = [
  {
    id: "USR-001",
    name: "NDOC Central Administrator",
    email: "admin@floodmanagement.com",
    role: "admin",
    jurisdiction: "National Command (NDOC New Delhi)",
    status: "active",
    lastLogin: "Just now",
    mfaEnabled: true,
  },
  {
    id: "USR-002",
    name: "BMC Disaster Management Cell",
    email: "mumbai.municipality@floodmanagement.com",
    role: "municipality",
    jurisdiction: "Mumbai Metro (MCGM)",
    status: "active",
    lastLogin: "14 mins ago",
    mfaEnabled: true,
  },
  {
    id: "USR-003",
    name: "PMC Disaster Management Office",
    email: "pune.municipality@floodmanagement.com",
    role: "municipality",
    jurisdiction: "Pune Municipal Corporation",
    status: "active",
    lastLogin: "2 hours ago",
    mfaEnabled: true,
  },
  {
    id: "USR-004",
    name: "NDRF 5th Battalion Unit Alpha",
    email: "rescuer@floodmanagement.com",
    role: "rescuer",
    jurisdiction: "Western Command (Maharashtra / Goa)",
    status: "active",
    lastLogin: "5 mins ago",
    mfaEnabled: true,
  },
  {
    id: "USR-005",
    name: "Citizen Test User",
    email: "citizen@floodmanagement.com",
    role: "citizen",
    jurisdiction: "Kurla West, Mumbai",
    status: "active",
    lastLogin: "45 mins ago",
    mfaEnabled: false,
  },
  {
    id: "USR-006",
    name: "Sandip Lakhera (Citizen)",
    email: "testuser@example.com",
    role: "citizen",
    jurisdiction: "Dadar, Mumbai",
    status: "active",
    lastLogin: "1 hour ago",
    mfaEnabled: false,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<SystemUser[]>(SYSTEM_USERS_ROSTER);
  const [selectedRole, setSelectedRole] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
    const updated = users.find((u) => u.id === id);
    setToastMessage(
      `User ${updated?.name} account status toggled to ${
        updated?.status === "active" ? "SUSPENDED" : "ACTIVE"
      }.`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-900 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              ROLE-BASED ACCESS CONTROL (RBAC) & PERSONNEL DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Access Control & Personnel Management
          </h1>
          <p className="text-sm text-slate-600">
            Institutional directory of emergency operators, civic commissioners, NDRF battalion leads, and registered citizens.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-slate-300 font-mono text-xs py-1 px-2.5">
            TOTAL ACCOUNTS: {users.length}
          </Badge>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* KPI Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Admin Officers</span>
            <Shield className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {users.filter((u) => u.role === "admin").length} Accounts
          </div>
          <div className="text-[11px] text-slate-500">Full System Clearance</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Municipal Operators</span>
            <Building className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-700 mt-1">
            {users.filter((u) => u.role === "municipality").length} Accounts
          </div>
          <div className="text-[11px] text-blue-700">Civic Triage Desks</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Tactical Rescuers</span>
            <Radio className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {users.filter((u) => u.role === "rescuer").length} Accounts
          </div>
          <div className="text-[11px] text-emerald-700">Field Dispatch Radios</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Public Citizens</span>
            <Users className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {users.filter((u) => u.role === "citizen").length} Accounts
          </div>
          <div className="text-[11px] text-slate-500">Verified Reporting Access</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Roles" },
            { id: "admin", label: "Admins" },
            { id: "municipality", label: "Municipality" },
            { id: "rescuer", label: "Rescuers" },
            { id: "citizen", label: "Citizens" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={selectedRole === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole(cat.id)}
              className="text-xs h-7 shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search by name, email, or jurisdiction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Users Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Authorized Personnel Roster
            </CardTitle>
            <p className="text-xs text-slate-500">
              Synchronized with MongoDB Atlas Identity Vault
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredUsers.length} USERS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">User Name & ID</th>
                <th className="py-2.5 px-4">Email Address</th>
                <th className="py-2.5 px-4">Portal Role</th>
                <th className="py-2.5 px-4">Jurisdiction & Post</th>
                <th className="py-2.5 px-4">Security MFA</th>
                <th className="py-2.5 px-4">Last Activity</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{item.email}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`uppercase font-mono text-[10px] ${
                        item.role === "admin"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : item.role === "municipality"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : item.role === "rescuer"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-50 text-slate-800 border-slate-200"
                      }`}
                    >
                      {item.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px]">{item.jurisdiction}</td>
                  <td className="py-3 px-4 font-mono text-[10px]">
                    {item.mfaEnabled ? (
                      <span className="text-emerald-700 font-bold">2FA ACTIVE</span>
                    ) : (
                      <span className="text-slate-400">PASSWORD ONLY</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{item.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(item.id)}
                      className={`text-[11px] h-7 px-2 font-semibold ${
                        item.status === "active"
                          ? "border-red-200 text-red-700 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {item.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
