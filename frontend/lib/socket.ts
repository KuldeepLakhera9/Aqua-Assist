"use client";

import { io, Socket } from "socket.io-client";
import { getAuthToken } from "./auth";

let socketInstance: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5003";

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!socketInstance) {
    const token = getAuthToken();

    socketInstance = io(SOCKET_URL, {
      auth: {
        token: token || undefined,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ [NDMS Telemetry] Socket.IO connected:", socketInstance?.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("⚡ [NDMS Telemetry] Socket.IO disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("⚡ [NDMS Telemetry] Socket connection error:", err.message);
    });
  }

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
