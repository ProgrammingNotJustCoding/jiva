import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

export const generateToken = (
  userId: string,
  sessionId: string,
  role: string,
): string => {
  return jwt.sign({ userId, sessionId, role }, env.JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (
  token: string,
): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
