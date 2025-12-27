export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    SEND_OTP: "/api/v1/auth/otp",
    LOGIN: "/api/v1/auth/login",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    LOGOUT: "/api/v1/auth/logout",
    GOOGLE_LINK: "/api/v1/auth/google-link",
    GOOGLE_CALLBACK: "/api/v1/auth/google/callback",
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  GOOGLE_CALLBACK: "/oauth-google-callback",
  PAYMENT: "/payment/:orderId",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;
