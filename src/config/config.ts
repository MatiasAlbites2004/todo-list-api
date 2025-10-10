import dotenv from "dotenv";
import { StringValue } from "ms";
dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: StringValue; 
  nodeEnv: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || "1h", 
  nodeEnv: process.env.NODE_ENV || "development",
};
