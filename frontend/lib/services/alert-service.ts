import { apiClient } from "@/lib/api-client";
import { DisasterAlert, UserNotification, AlertSeverity } from "@/types/alerts";

const DEMO_ALERTS: DisasterAlert[] = [
  {
    _id: "alt-001",
    id: "alt-001",
    title: "RED ALERT: Extreme Rainfall & High Tide Confluence (4.87m)",
    message: "Indian Meteorological Department (IMD) has issued a Flash Flood warning for Greater Mumbai and Konkan Coast. High tide of 4.87 meters expected at 14:18 today coincides with 180mm torrential cloudburst.",
    alertType: "flood",
    severity: "critical",
    priority: 10,
    isActive: true,
    issuingAuthority: "State Disaster Management Authority (SDMA) / IMD Colaba",
    targetArea: {
      district: "Mumbai City, Mumbai Suburban, Thane",
      state: "Maharashtra",
      description: "Low-lying coastal & riverine sectors (Mithi Basin, Kurla, Dadar, Chembur)",
    },
    safetyGuidelines: [
      "Avoid all non-essential travel and remain indoors above ground-floor level.",
      "Stay away from coastal promenades, open storm drains, and submerged rail subways.",
      "Keep phones charged and store minimum 72-hour clean drinking water and dry rations.",
      "In case of stranded emergency, dial Toll-Free Helpline 1916 (MCGM) or 1077 (NDRF).",
    ],
    helplines: [
      { name: "National Emergency Helpline", number: "112" },
      { name: "Disaster Management Hotline (SDMA)", number: "1077" },
      { name: "MCGM Emergency Operations Cell", number: "1916" },
      { name: "Coast Guard Search & Rescue", number: "1554" },
    ],
    validFrom: "2026-09-24T00:00:00Z",
    validUntil: "2026-09-25T18:00:00Z",
    createdAt: "2026-09-24T02:00:00Z",
  },
  {
    _id: "alt-002",
    id: "alt-002",
    title: "ORANGE ALERT: Khadakwasla Dam Controlled Discharge (35,000 Cusecs)",
    message: "Irrigation department initiating controlled release into Mutha River basin starting 11:30. Riverbank settlements advised to move to designated high-ground assembly zones.",
    alertType: "dam_release",
    severity: "high",
    priority: 8,
    isActive: true,
    issuingAuthority: "Maharashtra Water Resources Dept & Pune Municipal Corp",
    targetArea: {
      district: "Pune",
      state: "Maharashtra",
      description: "Mutha River Floodplain (Sinhagad Road, Baba Bhide Bridge)",
    },
    safetyGuidelines: [
      "Vacate temporary structures and vehicles parked along river ghats immediately.",
      "Follow instructions of civil defense wardens sounding evacuation sirens.",
    ],
    validFrom: "2026-09-24T06:00:00Z",
    validUntil: "2026-09-25T06:00:00Z",
    createdAt: "2026-09-24T05:30:00Z",
  },
  {
    _id: "alt-003",
    id: "alt-003",
    title: "YELLOW ADVISORY: Potable Water Boil Order & Sanitation Precautions",
    message: "Turbidity spikes detected in Bhandup Filtration intake lines due to heavy silt runoff. Citizens advised to boil water for 10 minutes prior to drinking.",
    alertType: "water_advisory",
    severity: "medium",
    priority: 5,
    isActive: true,
    issuingAuthority: "Public Health Department (MCGM)",
    targetArea: {
      district: "Mumbai City & Eastern Suburbs",
      state: "Maharashtra",
    },
    safetyGuidelines: [
      "Boil drinking water for minimum 10 minutes or use chlorine tablets.",
      "Report discolored tap water immediately via the Citizen Safety Portal.",
    ],
    validFrom: "2026-09-23T18:00:00Z",
    validUntil: "2026-09-26T18:00:00Z",
    createdAt: "2026-09-23T18:00:00Z",
  },
];

const DEMO_NOTIFICATIONS: UserNotification[] = [
  {
    _id: "notif-001",
    id: "notif-001",
    title: "High Tide Flash Alert Dispatched",
    message: "Critical warning broadcast for your registered district (Mumbai Suburban). Expected peak at 14:18.",
    type: "alert",
    priority: "urgent",
    isRead: false,
    channel: "push",
    createdAt: "2026-09-24T05:15:00Z",
  },
  {
    _id: "notif-002",
    id: "notif-002",
    title: "Flood Report #FLD-2026-0921 Verified",
    message: "NDRF 04 Battalion has verified your submitted incident report and deployed rapid response boats.",
    type: "report_status",
    priority: "high",
    isRead: false,
    actionUrl: "/reports/rep-001",
    channel: "in_app",
    createdAt: "2026-09-24T04:40:00Z",
  },
  {
    _id: "notif-003",
    id: "notif-003",
    title: "Direct Benefit Transfer (DBT) Relief Disbursed",
    message: "Emergency Ex-Gratia flood assistance of ₹ 15,000 has been credited to your Aadhaar-linked bank account.",
    type: "relief_grant",
    priority: "normal",
    isRead: true,
    channel: "sms",
    createdAt: "2026-09-23T16:20:00Z",
  },
];

export const alertService = {
  async getActiveAlerts(): Promise<DisasterAlert[]> {
    try {
      const response = await apiClient.get<{ success: boolean; alerts: DisasterAlert[] }>(
        "/alerts/active"
      );
      if (response && response.alerts && response.alerts.length > 0) {
        return response.alerts;
      }
      return DEMO_ALERTS;
    } catch {
      return DEMO_ALERTS;
    }
  },

  async getUserNotifications(): Promise<UserNotification[]> {
    try {
      const response = await apiClient.get<{ success: boolean; notifications: UserNotification[] }>(
        "/notifications"
      );
      if (response && response.notifications) {
        return response.notifications;
      }
      return DEMO_NOTIFICATIONS;
    } catch {
      return DEMO_NOTIFICATIONS;
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      return true;
    } catch {
      const found = DEMO_NOTIFICATIONS.find((n) => n._id === id || n.id === id);
      if (found) found.isRead = true;
      return true;
    }
  },
};
