"use client";

import * as React from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";

export interface EmergencyAlertPayload {
  id?: string;
  type: string;
  location?: any;
  message: string;
  timestamp: string | Date;
  severity?: "critical" | "high" | "advisory" | "normal";
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  liveAlerts: EmergencyAlertPayload[];
  activeBroadcast: EmergencyAlertPayload | null;
  dismissBroadcast: () => void;
  sendEmergencySOS: (location: string, state?: string, district?: string) => void;
  joinLocation: (state: string, district: string) => void;
  simulateAlert: (type: "SOS" | "GAUGE" | "WEATHER") => void;
}

const SocketContext = React.createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [liveAlerts, setLiveAlerts] = React.useState<EmergencyAlertPayload[]>([]);
  const [activeBroadcast, setActiveBroadcast] = React.useState<EmergencyAlertPayload | null>(null);

  React.useEffect(() => {
    const s = getSocket();
    if (!s) return;

    setSocket(s);

    if (s.connected) {
      setIsConnected(true);
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onEmergencyAlert = (data: any) => {
      const alertItem: EmergencyAlertPayload = {
        id: `alert-${Date.now()}`,
        type: data.type || "SOS",
        location: data.location,
        message: data.message || "Urgent Emergency SOS Received",
        timestamp: data.timestamp || new Date(),
        severity: "critical",
      };

      setLiveAlerts((prev) => [alertItem, ...prev.slice(0, 19)]);
      setActiveBroadcast(alertItem);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("emergency-alert", onEmergencyAlert);

    // Default join Mumbai / Maharashtra emergency room
    s.emit("join-location", { state: "Maharashtra", district: "Mumbai" });

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("emergency-alert", onEmergencyAlert);
    };
  }, []);

  const sendEmergencySOS = (location: string, state = "Maharashtra", district = "Mumbai") => {
    if (socket && isConnected) {
      socket.emit("emergency-sos", {
        location: { address: location },
        state,
        district,
        timestamp: new Date().toISOString(),
      });
    }

    // Local optimistic addition
    const localAlert: EmergencyAlertPayload = {
      id: `sos-${Date.now()}`,
      type: "SOS",
      location: { address: location },
      message: `Emergency SOS signal dispatched for: ${location}`,
      timestamp: new Date(),
      severity: "critical",
    };
    setLiveAlerts((prev) => [localAlert, ...prev.slice(0, 19)]);
    setActiveBroadcast(localAlert);
  };

  const joinLocation = (state: string, district: string) => {
    if (socket && isConnected) {
      socket.emit("join-location", { state, district });
    }
  };

  const simulateAlert = (type: "SOS" | "GAUGE" | "WEATHER") => {
    let mockAlert: EmergencyAlertPayload;
    if (type === "SOS") {
      mockAlert = {
        id: `sim-sos-${Date.now()}`,
        type: "SOS",
        location: { address: "Kranti Nagar Sector 4, Kurla West" },
        message: "SOS BEACON: 4 civilians stranded on rooftop. Water depth 2.1m and rising rapidly.",
        timestamp: new Date(),
        severity: "critical",
      };
    } else if (type === "GAUGE") {
      mockAlert = {
        id: `sim-gauge-${Date.now()}`,
        type: "CWC GAUGE BREACH",
        location: { address: "Mithi River Hydro Station STN-01" },
        message: "CRITICAL BREACH: River stage reached 4.82m (Breached statutory danger level of 4.50m).",
        timestamp: new Date(),
        severity: "critical",
      };
    } else {
      mockAlert = {
        id: `sim-wx-${Date.now()}`,
        type: "IMD RED ALERT",
        location: { address: "Mumbai Metropolitan Region" },
        message: "EXTREME RAINFALL: Cloudburst detected over Powai-Kurla catchment (>75mm in 60 mins).",
        timestamp: new Date(),
        severity: "high",
      };
    }

    setLiveAlerts((prev) => [mockAlert, ...prev.slice(0, 19)]);
    setActiveBroadcast(mockAlert);
  };

  const dismissBroadcast = () => {
    setActiveBroadcast(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveAlerts,
        activeBroadcast,
        dismissBroadcast,
        sendEmergencySOS,
        joinLocation,
        simulateAlert,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = React.useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return ctx;
}
