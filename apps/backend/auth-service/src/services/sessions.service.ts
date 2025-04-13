import { and, eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { sessions } from "../database/schema/sessions.schema.ts";
import type { User } from "../database/types.ts";
import { generateToken } from "../utils/jwt.utils.ts";

import { randomBytes } from "crypto";
import { users } from "../database/schema/users.schema.ts";

export const createSession = async (user: User) => {
  const sessionToken = randomBytes(32).toString("hex");

  const [newSession] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      sessionToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .returning();

  if (!newSession) {
    throw new Error("Failed to create session");
  }

  const jwtToken = generateToken(
    String(user.id),
    String(newSession.id),
    user.role
  );

  return {
    sessionToken,
    jwtToken,
    expiresAt: newSession.expires,
  };
};

export const validateSession = async (sessionToken: string) => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.sessionToken, sessionToken),
        eq(sessions.isDeleted, false)
      )
    )
    .limit(1);

  if (!session) return null;

  if (new Date(session.expires) < new Date()) {
    await invalidateSession(sessionToken);
    return null;
  }

  return session;
};

export const invalidateSession = async (sessionToken: string) => {
  return db
    .update(sessions)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
    })
    .where(eq(sessions.sessionToken, sessionToken));
};
