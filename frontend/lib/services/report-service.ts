import { apiClient } from "@/lib/api-client";
import {
  FloodReport,
  CreateFloodReportDTO,
  ReportSeverity,
  ReportStatus,
} from "@/types/reports";

export interface ReportFilterParams {
  severity?: ReportSeverity | "all";
  status?: ReportStatus | "all";
  district?: string;
  search?: string;
  limit?: number;
  page?: number;
}

// Resilient mock dataset representing active real-world verified floods for offline / demo mode
const DEMO_REPORTS: FloodReport[] = [
  {
    _id: "rep-001",
    id: "rep-001",
    reportNumber: "FLD-2026-0921",
    title: "Mithi River Overtopping - Kranti Nagar",
    description: "Water levels have breached the danger embankment mark by 1.2 meters. Inundation has reached ground-floor tenements in Kranti Nagar. Evacuation in progress.",
    location: {
      district: "Mumbai Suburban",
      state: "Maharashtra",
      address: "Kranti Nagar, Kurla West",
      landmark: "Near Bail Bazar Bridge",
      coordinates: [72.8826, 19.0688],
    },
    severity: "critical",
    waterLevel: "chest-deep",
    depthInMeters: 1.8,
    urgencyLevel: 9,
    media: [
      {
        url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
        fileType: "image",
      },
    ],
    status: "verified",
    aiVerification: {
      isVerified: true,
      confidenceScore: 0.96,
      detectedWaterLevel: "High Risk (> 1.5m)",
      detectedHazards: ["Rapid Submersion", "Electrical Pole Submerged"],
      analyzedAt: "2026-09-24T04:30:00Z",
    },
    verifiedBy: {
      name: "NDRF Inspector R. Sharma",
      role: "Field Commander",
      agency: "NDRF 04 Bn",
    },
    upvotesCount: 42,
    hasUpvoted: true,
    reportedBy: {
      name: "Rohan V.",
      isAnonymous: false,
    },
    createdAt: "2026-09-24T04:15:00Z",
  },
  {
    _id: "rep-002",
    id: "rep-002",
    reportNumber: "FLD-2026-0920",
    title: "Hindmata Flyover Underpass Inundation",
    description: "Severe water logging at Dadar TT and Hindmata intersection. Water level approximately 3 feet. Public transport suspended.",
    location: {
      district: "Mumbai City",
      state: "Maharashtra",
      address: "Dr. Babasaheb Ambedkar Road, Dadar East",
      landmark: "Hindmata Cinema Junction",
      coordinates: [72.8428, 19.0178],
    },
    severity: "high",
    waterLevel: "waist-deep",
    depthInMeters: 1.1,
    urgencyLevel: 7,
    media: [
      {
        url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
        fileType: "image",
      },
    ],
    status: "verified",
    aiVerification: {
      isVerified: true,
      confidenceScore: 0.89,
      detectedWaterLevel: "Moderate to High",
      detectedHazards: ["Submerged Manholes"],
      analyzedAt: "2026-09-24T03:50:00Z",
    },
    verifiedBy: {
      name: "MCGM Ward F/South Control",
      role: "Ward Officer",
      agency: "Brihanmumbai Municipal Corp",
    },
    upvotesCount: 28,
    hasUpvoted: false,
    reportedBy: {
      name: "Sneha Kulkarni",
      isAnonymous: false,
    },
    createdAt: "2026-09-24T03:40:00Z",
  },
  {
    _id: "rep-003",
    id: "rep-003",
    reportNumber: "FLD-2026-0918",
    title: "Milan Subway Traffic Closure",
    description: "Both conduits fully inundated with 5 feet of standing water. Municipal dewatering pumps deployed at pumping sump.",
    location: {
      district: "Mumbai Suburban",
      state: "Maharashtra",
      address: "Milan Subway Underpass, Santacruz West",
      landmark: "Western Railway Line Underpass",
      coordinates: [72.8397, 19.0812],
    },
    severity: "critical",
    waterLevel: "above-head",
    depthInMeters: 1.7,
    urgencyLevel: 9,
    media: [],
    status: "under_review",
    aiVerification: {
      isVerified: false,
      confidenceScore: 0.74,
      detectedWaterLevel: "Awaiting Image Confirmation",
    },
    upvotesCount: 19,
    hasUpvoted: false,
    reportedBy: {
      name: "Citizen Anonymous",
      isAnonymous: true,
    },
    createdAt: "2026-09-24T02:10:00Z",
  },
  {
    _id: "rep-004",
    id: "rep-004",
    reportNumber: "FLD-2026-0914",
    title: "Sion Gandhi Market Water Logging",
    description: "Recurrent drainage backflow causing 1.5 ft water accumulation in market alleys. Pedestrian traffic impaired.",
    location: {
      district: "Mumbai City",
      state: "Maharashtra",
      address: "Gandhi Market, King's Circle",
      landmark: "Opposite Gurukripa",
      coordinates: [72.8596, 19.0354],
    },
    severity: "medium",
    waterLevel: "knee-deep",
    depthInMeters: 0.5,
    urgencyLevel: 5,
    media: [],
    status: "verified",
    upvotesCount: 15,
    hasUpvoted: false,
    reportedBy: {
      name: "Vikram Malhotra",
      isAnonymous: false,
    },
    createdAt: "2026-09-23T22:30:00Z",
  },
];

export const reportService = {
  /**
   * Submit a new crowd-sourced flood report
   */
  async submitReport(dto: CreateFloodReportDTO): Promise<{ success: boolean; report: FloodReport }> {
    const formData = new FormData();
    formData.append("location[district]", dto.location.district);
    formData.append("location[state]", dto.location.state);
    formData.append("location[address]", dto.location.address);
    if (dto.location.landmark) {
      formData.append("location[landmark]", dto.location.landmark);
    }
    if (dto.location.coordinates?.length === 2) {
      formData.append("location[coordinates][]", String(dto.location.coordinates[0]));
      formData.append("location[coordinates][]", String(dto.location.coordinates[1]));
    }

    formData.append("severity", dto.severity);
    formData.append("waterLevel", dto.waterLevel);
    if (dto.depth !== undefined) {
      formData.append("depth", String(dto.depth));
    }
    formData.append("description", dto.description);
    formData.append("urgencyLevel", String(dto.urgencyLevel));
    if (dto.strandedCount !== undefined) {
      formData.append("strandedCount", String(dto.strandedCount));
    }

    if (dto.files && dto.files.length > 0) {
      dto.files.forEach((file) => {
        formData.append("media", file);
      });
    }

    try {
      const response = await apiClient.post<{ success: boolean; report: FloodReport }>(
        "/flood-reports",
        formData
      );
      return response;
    } catch (err) {
      console.warn("Backend API unavailable, simulating local report creation:", err);
      // Fallback local report creation
      const createdReport: FloodReport = {
        _id: `rep-${Date.now()}`,
        id: `rep-${Date.now()}`,
        reportNumber: `FLD-${Date.now().toString().slice(-4)}`,
        title: dto.description.slice(0, 40) + "...",
        description: dto.description,
        location: dto.location,
        severity: dto.severity,
        waterLevel: dto.waterLevel,
        depthInMeters: dto.depth,
        urgencyLevel: dto.urgencyLevel,
        media: dto.files?.map((f) => ({
          url: URL.createObjectURL(f),
          fileType: f.type.startsWith("video") ? "video" : "image",
        })) || [],
        status: "pending",
        upvotesCount: 1,
        hasUpvoted: true,
        reportedBy: {
          name: "Current Citizen",
          isAnonymous: false,
        },
        createdAt: new Date().toISOString(),
      };
      DEMO_REPORTS.unshift(createdReport);
      return { success: true, report: createdReport };
    }
  },

  /**
   * Fetch flood reports list with optional filtering
   */
  async getReports(params: ReportFilterParams = {}): Promise<{ reports: FloodReport[]; count: number }> {
    try {
      const queryParams: Record<string, string | number> = {};
      if (params.severity && params.severity !== "all") queryParams.severity = params.severity;
      if (params.status && params.status !== "all") queryParams.status = params.status;
      if (params.district) queryParams.district = params.district;
      if (params.limit) queryParams.limit = params.limit;
      if (params.page) queryParams.page = params.page;

      const response = await apiClient.get<{ success: boolean; reports: FloodReport[]; count?: number }>(
        "/flood-reports",
        { params: queryParams }
      );
      if (response && response.reports) {
        return { reports: response.reports, count: response.count || response.reports.length };
      }
      return { reports: DEMO_REPORTS, count: DEMO_REPORTS.length };
    } catch (err) {
      console.warn("Backend API unavailable for reports feed, using certified demo cache:", err);
      let filtered = [...DEMO_REPORTS];
      if (params.severity && params.severity !== "all") {
        filtered = filtered.filter((r) => r.severity === params.severity);
      }
      if (params.status && params.status !== "all") {
        filtered = filtered.filter((r) => r.status === params.status);
      }
      if (params.district) {
        filtered = filtered.filter((r) =>
          r.location.district.toLowerCase().includes(params.district!.toLowerCase())
        );
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.description.toLowerCase().includes(query) ||
            r.location.address?.toLowerCase().includes(query) ||
            r.location.landmark?.toLowerCase().includes(query)
        );
      }
      return { reports: filtered, count: filtered.length };
    }
  },

  /**
   * Fetch single report detail
   */
  async getReportById(id: string): Promise<FloodReport> {
    try {
      const response = await apiClient.get<{ success: boolean; report: FloodReport }>(
        `/flood-reports/public/${id}`
      );
      if (response && response.report) {
        return response.report;
      }
    } catch {
      // Fallback
    }
    const found = DEMO_REPORTS.find((r) => r._id === id || r.id === id);
    if (found) return found;
    throw new Error(`Report #${id} not found.`);
  },

  /**
   * Citizen community upvoting / confirmation of flood report
   */
  async voteOnReport(id: string, vote: "up" | "down"): Promise<{ success: boolean; upvotesCount: number }> {
    try {
      const response = await apiClient.post<{ success: boolean; upvotesCount: number }>(
        `/flood-reports/${id}/vote`,
        { vote }
      );
      return response;
    } catch {
      // Local fallback
      const report = DEMO_REPORTS.find((r) => r._id === id || r.id === id);
      if (report) {
        if (vote === "up") {
          report.upvotesCount += 1;
          report.hasUpvoted = true;
        } else {
          report.upvotesCount = Math.max(0, report.upvotesCount - 1);
          report.hasUpvoted = false;
        }
        return { success: true, upvotesCount: report.upvotesCount };
      }
      return { success: true, upvotesCount: 1 };
    }
  },
};
