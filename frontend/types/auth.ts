export type UserRole =
  | "citizen"
  | "user"
  | "volunteer"
  | "official"
  | "admin"
  | "municipality"
  | "rescuer";

export interface UserLocation {
  district?: string;
  state?: string;
  address?: string;
  pincode?: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roles?: UserRole[];
  location?: UserLocation;
  governmentId?: string;
  isVerified?: boolean;
  trustScore?: number;
  rescueTeam?: string;
  createdAt?: string;
  preferences?: {
    language?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      inApp?: boolean;
    };
  };
}

export interface AuthResponse {
  message?: string;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserProfile;
}

export interface LoginCredentials {
  login: string; // Email or phone
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  governmentId?: string;
  location: {
    district: string;
    state: string;
    address?: string;
    coordinates: [number, number];
  };
}
