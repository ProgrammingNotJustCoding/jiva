import type { Context } from "hono";
import { z } from "zod";
import { generateUserCode } from "../../services/code.service.ts";
import { hashPassword, verifyPassword } from "../../utils/hash.utils.ts";
import { errors } from "../constants/errors.ts";
import {
  getUserByCode,
  getUserById,
  insertUser,
} from "../../services/users.service.ts";
import logger from "../../config/logger.ts";
import { generateToken, verifyToken } from "../../utils/jwt.utils.ts";
import type { JwtPayload } from "jsonwebtoken";
import { submitUserDetailsToShiftService } from "../../services/userDetails.service.ts";

export const createAccount = async (c: Context) => {
  const body = await c.req.json();

  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(["supervisor", "worker"]),
    phoneNumber: z.string().min(1).max(10),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    return c.json(
      {
        error: errors[400],
      },
      400,
    );
  }

  const { firstName, lastName, role, phoneNumber } = result.data;
  const name = `${firstName} ${lastName}`;
  const userCode = generateUserCode(name);

  const passwordHash = await hashPassword("password");

  const user = {
    name,
    role,
    userCode,
    passwordHash,
  };

  const existingUser = await getUserByCode(userCode);

  if (existingUser) {
    return c.json(
      {
        error: errors[409],
      },
      409,
    );
  }

  let newUser;
  try {
    newUser = await insertUser(user);
  } catch (error) {
    logger.error("Error inserting user:", error);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }

  try {
    await submitUserDetailsToShiftService(
      String(newUser.id),
      firstName,
      lastName,
      phoneNumber,
      role,
    );
  } catch (e) {
    return c.json({
      error: errors[500],
      details: `Error submitting user details to Shift Service: ${e}`,
    });
  }

  return c.text("OK", 201);
};

export const signIn = async (c: Context) => {
  const body = await c.req.json();

  const schema = z.object({
    userCode: z.string().min(1),
    password: z.string().min(1),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    return c.json(
      {
        error: errors[400],
      },
      400,
    );
  }

  const { userCode, password } = result.data;

  let user;
  try {
    user = await getUserByCode(userCode);
    if (!user) {
      return c.json(
        {
          error: errors[401],
        },
        401,
      );
    }
  } catch (e) {
    logger.error("Error fetching user:", e);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return c.json(
      {
        error: errors[401],
      },
      401,
    );
  }

  let token = generateToken(String(user.id), user.role);

  return c.json(
    {
      data: {
        token,
      },
    },
    200,
  );
};

export const verifyAuth = async (c: Context) => {
  const authHeader = c.req.header("Authorization");

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return c.json(
      {
        error: errors[401],
      },
      401,
    );
  }

  try {
    const payload = verifyToken(token) as JwtPayload;
    const user = await getUserById(Number(payload.userId));
    if (!user) {
      return c.json(
        {
          error: errors[401],
        },
        401,
      );
    }
    return c.json(
      {
        data: {
          id: String(user.id),
          name: user.name,
          role: user.role,
          userCode: user.userCode,
        },
      },
      200,
    );
  } catch (error) {
    logger.error("Error verifying token:", error);
    return c.json(
      {
        error: errors[401],
      },
      401,
    );
  }
};
