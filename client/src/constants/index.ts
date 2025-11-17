export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    SEND_OTP: "/auth/otp",
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    GOOGLE_LINK: "/auth/google-link",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  GOOGLE_CALLBACK: "/oauth-google-callback",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;
