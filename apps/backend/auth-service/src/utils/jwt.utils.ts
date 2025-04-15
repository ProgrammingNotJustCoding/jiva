import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
