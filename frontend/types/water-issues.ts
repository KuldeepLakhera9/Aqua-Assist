export type WaterIssueCategory =
  | "drainage_overflow"
  | "clogged_drain"
  | "sewage_backflow"
  | "drinking_water_contamination"
  | "pipeline_burst"
  | "submerged_transformer"
  | "stagnant_water";

export type WaterIssueStatus =
  | "reported"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface WaterIssue {
  _id: string;
  id?: string;
  title: string;
  category: WaterIssueCategory;
  description: string;
  location: {
    district: string;
    ward?: string;
    address: string;
    landmark?: string;
    coordinates?: [number, number];
  };
  severity: "low" | "medium" | "high" | "critical";
  status: WaterIssueStatus;
  reportedBy: {
    name: string;
    phone?: string;
  };
  upvotesCount: number;
  hasUpvoted?: boolean;
  assignedMunicipality?: string;
  assignedTeam?: string;
  actionTaken?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface CreateWaterIssueDTO {
  title: string;
  category: WaterIssueCategory;
  description: string;
  location: {
    district: string;
    ward?: string;
    address: string;
    landmark?: string;
    coordinates?: [number, number];
  };
  severity: "low" | "medium" | "high" | "critical";
  file?: File;
}
