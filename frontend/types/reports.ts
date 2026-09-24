export type WaterDepthLevel =
  | "ankle-deep"
  | "knee-deep"
  | "waist-deep"
  | "chest-deep"
  | "above-head";

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export type ReportStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "resolved"
  | "rejected";

export interface ReportLocation {
  district: string;
  state: string;
  address?: string;
  landmark?: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ReportMedia {
  url: string;
  publicId?: string;
  fileType: "image" | "video";
  thumbnailUrl?: string;
}

export interface AIVerificationResult {
  isVerified: boolean;
  confidenceScore: number;
  detectedWaterLevel?: string;
  detectedHazards?: string[];
  analyzedAt?: string;
}

export interface FloodReport {
  _id: string;
  id?: string;
  reportNumber?: string;
  title?: string;
  description: string;
  location: ReportLocation;
  severity: ReportSeverity;
  waterLevel: WaterDepthLevel;
  depthInMeters?: number;
  urgencyLevel: number; // 1 - 10
  media: ReportMedia[];
  status: ReportStatus;
  aiVerification?: AIVerificationResult;
  verifiedBy?: {
    name: string;
    role: string;
    agency: string;
  };
  upvotesCount: number;
  hasUpvoted?: boolean;
  reportedBy?: {
    _id?: string;
    name: string;
    isAnonymous?: boolean;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFloodReportDTO {
  location: {
    district: string;
    state: string;
    address: string;
    landmark?: string;
    coordinates: [number, number];
  };
  severity: ReportSeverity;
  waterLevel: WaterDepthLevel;
  depth?: number;
  description: string;
  urgencyLevel: number;
  strandedCount?: number;
  files?: File[];
}
