import { apiClient } from "@/lib/api-client";
import {
  WaterIssue,
  CreateWaterIssueDTO,
  WaterIssueCategory,
  WaterIssueStatus,
} from "@/types/water-issues";

const DEMO_WATER_ISSUES: WaterIssue[] = [
  {
    _id: "wi-001",
    id: "wi-001",
    title: "Storm Drain Clogged with Debris & Plastic Waste",
    category: "clogged_drain",
    description: "Main storm drain opposite station gate is heavily obstructed with construction rubble and plastic waste, causing immediate backflow onto pedestrian sidewalk.",
    location: {
      district: "Mumbai Suburban",
      ward: "Ward H/East",
      address: "Station Road, Santacruz East",
      landmark: "Near Railway Foot-Overbridge",
      coordinates: [72.8423, 19.0831],
    },
    severity: "high",
    status: "in_progress",
    reportedBy: {
      name: "Pradeep Joshi",
      phone: "+91 98200 12345",
    },
    upvotesCount: 34,
    hasUpvoted: true,
    assignedMunicipality: "MCGM",
    assignedTeam: "Drainage Maintenance Unit 3",
    actionTaken: "Suction tanker and jetting machine deployed at 07:00.",
    createdAt: "2026-09-24T01:30:00Z",
  },
  {
    _id: "wi-002",
    id: "wi-002",
    title: "Drinking Water Pipeline Contamination by Flood Seepage",
    category: "drinking_water_contamination",
    description: "Brown murky water emitting chemical odor coming from municipal taps in building clusters. Suspected underground main line fracture mixing with gutter overflow.",
    location: {
      district: "Mumbai Suburban",
      ward: "Ward L",
      address: "Nehru Nagar Block 4, Kurla East",
      landmark: "Opposite Municipal Dispensary",
      coordinates: [72.8798, 19.0621],
    },
    severity: "critical",
    status: "acknowledged",
    reportedBy: {
      name: "Meenakshi Sundaram",
      phone: "+91 98205 67890",
    },
    upvotesCount: 56,
    hasUpvoted: false,
    assignedMunicipality: "MCGM",
    assignedTeam: "Hydraulic Engineer Dept - Water Quality Cell",
    actionTaken: "Water supply shut off to the line; potable water tankers dispatched.",
    createdAt: "2026-09-24T03:00:00Z",
  },
  {
    _id: "wi-003",
    id: "wi-003",
    title: "Sewer Chamber Overflow on Main Carriage Way",
    category: "sewage_backflow",
    description: "Manhole lid displaced by hydraulic pressure during high tide, spewing black water across both road lanes.",
    location: {
      district: "Mumbai City",
      ward: "Ward G/North",
      address: "Senapati Bapat Marg, Lower Parel",
      landmark: "Near Marathon Futurex",
      coordinates: [72.8311, 18.9958],
    },
    severity: "high",
    status: "reported",
    reportedBy: {
      name: "Karan Singhania",
      phone: "+91 99201 99887",
    },
    upvotesCount: 19,
    hasUpvoted: false,
    assignedMunicipality: "MCGM",
    createdAt: "2026-09-24T04:45:00Z",
  },
  {
    _id: "wi-004",
    id: "wi-004",
    title: "High-Voltage Transformer Foundation Submerged in Stagnant Water",
    category: "submerged_transformer",
    description: "Electrical utility transformer plinth is flooded under 2 ft of water. Risk of short circuit and electrocution to pedestrians.",
    location: {
      district: "Mumbai Suburban",
      ward: "Ward K/West",
      address: "SV Road, Andheri West",
      landmark: "Near Shoppers Stop Signal",
      coordinates: [72.8354, 19.1197],
    },
    severity: "critical",
    status: "resolved",
    reportedBy: {
      name: "Devendra Patil",
    },
    upvotesCount: 81,
    hasUpvoted: true,
    assignedMunicipality: "Adani Electricity / MCGM",
    assignedTeam: "Power Grid Safety Squad",
    actionTaken: "Feed isolated, sandbag barrier erected, submersible pump dewatered basin.",
    resolvedAt: "2026-09-24T05:30:00Z",
    createdAt: "2026-09-23T20:10:00Z",
  },
];

export const waterIssueService = {
  async getIssues(params: { category?: string; status?: string; search?: string } = {}): Promise<WaterIssue[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: WaterIssue[] }>(
        "/water-issues",
        { params }
      );
      if (response && response.data) {
        return response.data;
      }
      return DEMO_WATER_ISSUES;
    } catch {
      let filtered = [...DEMO_WATER_ISSUES];
      if (params.category && params.category !== "all") {
        filtered = filtered.filter((i) => i.category === params.category);
      }
      if (params.status && params.status !== "all") {
        filtered = filtered.filter((i) => i.status === params.status);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(query) ||
            i.description.toLowerCase().includes(query) ||
            i.location.address.toLowerCase().includes(query)
        );
      }
      return filtered;
    }
  },

  async submitIssue(dto: CreateWaterIssueDTO): Promise<{ success: boolean; issue: WaterIssue }> {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("category", dto.category);
    formData.append("description", dto.description);
    formData.append("severity", dto.severity);
    formData.append("location[district]", dto.location.district);
    formData.append("location[address]", dto.location.address);
    if (dto.location.ward) formData.append("location[ward]", dto.location.ward);
    if (dto.location.landmark) formData.append("location[landmark]", dto.location.landmark);
    if (dto.file) formData.append("media", dto.file);

    try {
      const res = await apiClient.post<{ success: boolean; data: WaterIssue }>(
        "/water-issues",
        formData
      );
      return { success: true, issue: res.data };
    } catch {
      const created: WaterIssue = {
        _id: `wi-${Date.now()}`,
        id: `wi-${Date.now()}`,
        title: dto.title,
        category: dto.category,
        description: dto.description,
        location: dto.location,
        severity: dto.severity,
        status: "reported",
        reportedBy: { name: "Current Citizen" },
        upvotesCount: 1,
        hasUpvoted: true,
        createdAt: new Date().toISOString(),
      };
      DEMO_WATER_ISSUES.unshift(created);
      return { success: true, issue: created };
    }
  },

  async voteOnIssue(id: string): Promise<{ success: boolean; upvotesCount: number }> {
    try {
      const res = await apiClient.post<{ success: boolean; upvotesCount: number }>(
        `/water-issues/${id}/vote`,
        { vote: 1 }
      );
      return res;
    } catch {
      const issue = DEMO_WATER_ISSUES.find((i) => i._id === id || i.id === id);
      if (issue) {
        issue.upvotesCount += 1;
        issue.hasUpvoted = true;
        return { success: true, upvotesCount: issue.upvotesCount };
      }
      return { success: true, upvotesCount: 1 };
    }
  },
};
