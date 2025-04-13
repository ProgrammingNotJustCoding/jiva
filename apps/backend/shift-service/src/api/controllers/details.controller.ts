import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import logger from "../../config/logger.ts";
import {
  getUserDetailsById,
  insertUserDetails,
  softDeleteUserDetails,
  updateUserDetails,
} from "../../services/details.service.ts";

export const postUserDetails = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    userId: z.string(),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    phoneNumber: z.string().min(10).max(20),
    designation: z.string().min(2).max(100),
  });

  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      {
        error: errors[400],
        details: parsedBody.error.issues,
      },
      400,
    );
  }

  const userDetailsData = {
    userId: Number(parsedBody.data.userId),
    firstName: parsedBody.data.firstName,
    lastName: parsedBody.data.lastName,
    phoneNumber: parsedBody.data.phoneNumber,
    designation: parsedBody.data.designation,
  };

  try {
    await insertUserDetails(userDetailsData);
    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error posting user details: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: "Internal server error",
      },
      500,
    );
  }
};

export const getUserDetails = async (c: Context) => {
  const userId = Number(c.req.param("userId"));

  try {
    const userDetails = await getUserDetailsById(userId);
    return c.json(
      {
        data: userDetails,
      },
      200,
    );
  } catch (e) {
    logger.error(`Error getting user details: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: "Internal server error",
      },
      500,
    );
  }
};

export const putUserDetails = async (c: Context) => {
  const userId = Number(c.req.param("userId"));
  const body = await c.req.json();

  const bodySchema = z.object({
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    phoneNumber: z.string().min(10).max(20).optional(),
  });

  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      {
        error: errors[400],
        details: parsedBody.error.issues,
      },
      400,
    );
  }

  const updateUserDetailsData: Record<string, any> = {};
  if (parsedBody.data.firstName) {
    updateUserDetailsData.firstName = parsedBody.data.firstName;
  }
  if (parsedBody.data.lastName) {
    updateUserDetailsData.lastName = parsedBody.data.lastName;
  }
  if (parsedBody.data.phoneNumber) {
    updateUserDetailsData.phoneNumber = parsedBody.data.phoneNumber;
  }

  try {
    await updateUserDetails(userId, updateUserDetailsData);
    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error updating user details: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: "Internal server error",
      },
      500,
    );
  }
};

export const deleteUserDetails = async (c: Context) => {
  const userId = Number(c.req.param("userId"));

  try {
    await softDeleteUserDetails(userId);
    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error deleting user details: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: "Internal server error",
      },
      500,
    );
  }
};
