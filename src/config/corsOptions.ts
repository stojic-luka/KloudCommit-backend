import { CorsOptions } from "cors";
import allowedCorsOrigins from "./allowedOrigins";

export const corsOptions: CorsOptions = {
  origin: allowedCorsOrigins,
  credentials: true,
};
