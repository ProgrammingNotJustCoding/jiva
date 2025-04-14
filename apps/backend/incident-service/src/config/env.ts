import { z } from "zod";
import { config } from "dotenv";

config();

type Environment = {
  PORT: number;
  NODE_ENV: string;
  DB_URL: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  S3_BUCKET_NAME: string;
  S3_BUCKET_ENDPOINT: string;
};

const envSchema = z.object({
  PORT: z.coerce.number().default(5004),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DB_URL: z
    .string()
    .default("postgres://user:password@localhost:5432/incidentdb"),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().default("user"),
  AWS_SECRET_ACCESS_KEY: z.string().default("password"),
  S3_BUCKET_NAME: z.string().default("incident-bucket"),
  S3_BUCKET_ENDPOINT: z.string().default("http://localhost:9000"),
});

export const env = envSchema.parse(process.env) as Environment;
