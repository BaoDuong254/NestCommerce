import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GoogleAuthStateType } from "src/routes/auth/models/auth.model";
import envConfig from "src/shared/config";
import { google } from "googleapis";

@Injectable()
export class GoogleService {
  private readonly oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      redirectUri: envConfig.GOOGLE_REDIRECT_URI,
    });
  }
  getAuthorizationUrl({ userAgent, ip }: GoogleAuthStateType) {
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    // Convert state object to base64 string
    const stateString = Buffer.from(
      JSON.stringify({
        userAgent,
        ip,
      })
    ).toString("base64");

    const url = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope,
      include_granted_scopes: true,
      state: stateString,
    });

    return { url };
  }

  // async googleCallback({ code, state }: { code: string; state: string }) {
  //   try {
  //     let userAgent = "Unknown";
  //     let ip = "Unknown";
  //     // 1. Lấy state từ url
  //     try {
  //       if (state) {
  //         const clientInfo = JSON.parse(Buffer.from(state, "base64").toString()) as GoogleAuthStateType;
  //         userAgent = clientInfo.userAgent;
  //         ip = clientInfo.ip;
  //       }
  //     } catch (error) {
  //       console.error("Error parsing state", error);
  //     }
  //     // 2. Dùng code để lấy token
  //     const { tokens } = await this.oauth2Client.getToken(code);
  //     this.oauth2Client.setCredentials(tokens);

  //     // 3. Lấy thông tin google user
  //     const oauth2 = google.oauth2({
  //       auth: this.oauth2Client,
  //       version: "v2",
  //     });
  //     const { data } = await oauth2.userinfo.get();
  //     if (!data.email) {
  //       throw GoogleUserInfoError;
  //     }

  //     let user = await this.authRepository.findUniqueUserIncludeRole({
  //       email: data.email,
  //     });
  //     // Nếu không có user tức là người mới, vậy nên sẽ tiến hành đăng ký
  //     if (!user) {
  //       const clientRoleId = await this.sharedRoleRepository.getClientRoleId();
  //       const randomPassword = uuidv4();
  //       const hashedPassword = await this.hashingService.hash(randomPassword);
  //       user = await this.authRepository.createUserInclueRole({
  //         email: data.email,
  //         name: data.name ?? "",
  //         password: hashedPassword,
  //         roleId: clientRoleId,
  //         phoneNumber: "",
  //         avatar: data.picture ?? null,
  //       });
  //     }
  //     const device = await this.authRepository.createDevice({
  //       userId: user.id,
  //       userAgent,
  //       ip,
  //     });
  //     const authTokens = await this.authService.generateTokens({
  //       userId: user.id,
  //       deviceId: device.id,
  //       roleId: user.roleId,
  //       roleName: user.role.name,
  //     });
  //     return authTokens;
  //   } catch (error) {
  //     console.error("Error in googleCallback", error);
  //     throw error;
  //   }
  // }
}
