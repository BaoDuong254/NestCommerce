/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Server, Socket } from "socket.io";
import { generateRoomUserId } from "src/shared/helpers";
import { TokenService } from "src/shared/services/token.service";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import envConfig from "src/shared/config/env";
import { socketCorsConfig } from "src/shared/config/cors";

export class WebsocketAdapter extends IoAdapter {
  private readonly tokenService: TokenService;
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(app: INestApplicationContext) {
    super(app);
    this.tokenService = app.get(TokenService);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: envConfig.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: socketCorsConfig,
    }) as Server;

    server.adapter(this.adapterConstructor);

    server.use((socket, next) => {
      void this.authMiddleware(socket, next);
    });
    server.of(/.*/).use((socket, next) => {
      void this.authMiddleware(socket, next);
    });
    return server;
  }

  async authMiddleware(socket: Socket, next: (err?: any) => void) {
    const { authorization } = socket.handshake.headers;
    if (!authorization) {
      return next(new Error("Missing authorization header"));
    }
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
      return next(new Error("Missing access token"));
    }
    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken);
      await socket.join(generateRoomUserId(userId));
      next();
    } catch (error) {
      next(error);
    }
  }
}
