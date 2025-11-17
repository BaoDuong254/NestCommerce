export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: string | null;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  roleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  code: string;
}

export interface RegisterResponse extends Omit<User, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface SendOTPRequest {
  email: string;
  type: "REGISTER" | "FORGOT_PASSWORD";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface GoogleAuthUrlResponse {
  url: string;
}

export interface MessageResponse {
  message: string;
}
