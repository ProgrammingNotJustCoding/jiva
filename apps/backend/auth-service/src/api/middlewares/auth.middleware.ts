import type { Context, Next } from "hono";
import { validateSession } from "../../services/sessions.service.ts";
import { errors } from "../constants/errors.ts";
import { getCookie } from "hono/cookie";
import { getUserById } from "../../services/users.service.ts";

export const requireAuth = async (c: Context, next: Next) => {
  const sessionToken = getCookie(c, "sessiontoken");

  if (!sessionToken) {
    return c.json(
      {
        error: errors[401],
      },
      401
    );
  }

  const session = await validateSession(sessionToken);

  if (!session) {
    return c.json(
      {
        error: errors[401],
      },
      401
    );
  }

  const user = await getUserById(session.userId);
  c.set("user", user);

  await next();
};
