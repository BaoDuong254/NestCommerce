import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import envConfig from "src/shared/config/env";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      // "http://localhost:5173", // Vite dev server
      // "http://localhost:4173", // Vite preview
      envConfig.CLIENT_URL, // Production client URL
    ].filter(Boolean); // Remove undefined values

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const socketCorsConfig = {
  origin: corsConfig.origin,
  credentials: corsConfig.credentials,
  methods: ["GET", "POST"],
};
