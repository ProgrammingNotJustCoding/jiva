import { z } from "zod";
import { config } from "dotenv";

config();

type Environment = {
  PORT: number;
  NODE_ENV: string;
  DB_URL: string;
};

const envSchema = z.object({
  PORT: z.coerce.number().default(5003),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DB_URL: z.string().default("postgres://user:password@localhost:5432/shiftdb"),
});

export const env = envSchema.parse(process.env) as Environment;
