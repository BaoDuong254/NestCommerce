import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GoogleAuthStateType } from "src/routes/auth/models/auth.model";
import envConfig from "src/shared/config/env";
import { google } from "googleapis";
import { AuthRepository } from "src/routes/auth/auth.repo";
import { HashingService } from "src/shared/services/hashing.service";
import { SharedRoleRepository } from "src/shared/repositories/shared-role.repo";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "src/routes/auth/auth.service";
import { GoogleUserInfoError } from "src/routes/auth/auth.error";

@Injectable()
export class GoogleService {
  private readonly oauth2Client: OAuth2Client;
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly authService: AuthService
  ) {
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

  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = "Unknown";
      let ip = "Unknown";
      // Get state from url, then get userAgent and ip from state
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, "base64").toString()) as GoogleAuthStateType;
          userAgent = clientInfo.userAgent;
          ip = clientInfo.ip;
        }
      } catch (error) {
        console.error("Error parsing state", error);
      }

      // Get token from code
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: "v2",
      });
      const { data } = await oauth2.userinfo.get();
      if (!data.email) {
        throw GoogleUserInfoError;
      }

      let user = await this.authRepository.findUniqueUserIncludeRole({
        email: data.email,
      });

      // If user not found, create new user
      if (!user) {
        const clientRoleId = await this.sharedRoleRepository.getClientRoleID();
        const randomPassword = uuidv4();
        const hashedPassword = await this.hashingService.hash(randomPassword);
        user = await this.authRepository.createUserIncludeRole({
          email: data.email,
          name: data.name ?? "",
          password: hashedPassword,
          roleId: clientRoleId,
          phoneNumber: "",
          avatar: data.picture ?? null,
        });
      }
      // Create device
      const device = await this.authRepository.createDevice({
        userId: user.id,
        userAgent,
        ip,
      });
      // Generate tokens
      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      });
      return authTokens;
    } catch (error) {
      console.error("Error in googleCallback", error);
      throw error;
    }
  }
}
