export type AlertSeverity = "info" | "low" | "medium" | "high" | "critical";

export type AlertType =
  | "flood"
  | "heavy_rainfall"
  | "cyclone"
  | "dam_release"
  | "evacuation"
  | "water_advisory"
  | "weather";

export interface DisasterAlert {
  _id: string;
  id?: string;
  title: string;
  message: string;
  alertType: AlertType;
  severity: AlertSeverity;
  priority: number;
  isActive: boolean;
  issuingAuthority: string;
  targetArea?: {
    type?: string;
    coordinates?: number[][][] | number[];
    district?: string;
    state?: string;
    description?: string;
    radiusInKm?: number;
  };
  safetyGuidelines?: string[];
  helplines?: Array<{
    name: string;
    number: string;
  }>;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export interface UserNotification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: "alert" | "report_status" | "relief_grant" | "system" | "sos_dispatch";
  priority: "normal" | "high" | "urgent";
  isRead: boolean;
  actionUrl?: string;
  channel: "in_app" | "sms" | "push" | "email";
  createdAt: string;
}
