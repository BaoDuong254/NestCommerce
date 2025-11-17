import http from "@/lib/http";
import { API_ENDPOINTS } from "@/constants";
import type {
  RegisterRequest,
  RegisterResponse,
  SendOTPRequest,
  MessageResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  GoogleAuthUrlResponse,
} from "@/types/auth";

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await http.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  async sendOTP(data: SendOTPRequest): Promise<MessageResponse> {
    const response = await http.post<MessageResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await http.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
    return response.data;
  },

  async logout(data: LogoutRequest): Promise<MessageResponse> {
    const response = await http.post<MessageResponse>(API_ENDPOINTS.AUTH.LOGOUT, data);
    return response.data;
  },

  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    const response = await http.get<GoogleAuthUrlResponse>(API_ENDPOINTS.AUTH.GOOGLE_LINK);
    return response.data;
  },
};
