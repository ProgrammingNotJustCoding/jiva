import { z } from "zod";

type Environment = {
    PORT: number;
    NODE_ENV: string;
    DB_URL: string;
    JWT_SECRET: string;
}

const envSchema = z.object({
    PORT: z.coerce.number().default(5001),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DB_URL: z.string().default("postgres://user:password@localhost:5432/authdb"),
    JWT_SECRET: z.string().default("your_jwt_secret"),
})

export const env = envSchema.parse(process.env) as Environment;
