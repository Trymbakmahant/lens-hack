export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
} as const;
