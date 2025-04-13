import type { Context } from "hono";
import { z } from "zod";
import { generateUserCode } from "../../services/code.service.ts";
import { hashPassword, verifyPassword } from "../../utils/hash.utils.ts";
import { errors } from "../constants/errors.ts";
import { getUserByCode, insertUser } from "../../services/users.service.ts";
import logger from "../../config/logger.ts";
import { createSession, invalidateSession } from "../../services/sessions.service.ts";
import { getCookie, setCookie } from "hono/cookie";
import { env } from "../../config/env.ts";

export const createAccount = async (c: Context) => {
    const body = await c.req.json();

    const schema = z.object({
        name: z.string().min(1),
        role: z.enum(["supervisor", "worker"]),
    });

    const result = schema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: errors[400]
        }, 400);
    }

    const { name, role } = result.data;
    const userCode = generateUserCode(name);

    const passwordHash = await hashPassword("password");

    const user = {
        name,
        role,
        userCode,
        passwordHash,
    }

    const existingUser = await getUserByCode(userCode);

    if (existingUser) {
        return c.json({
            error: errors[409]
        }, 409);
    }

    try {

        await insertUser(user);
        return c.text("OK", 201);
    } catch (error) {

        logger.error("Error inserting user:", error);
        return c.json({
            error: errors[500]
        }, 500);
    }
}

export const signIn = async (c: Context) => {
    const body = await c.req.json();

    const schema = z.object({
        userCode: z.string().min(1),
        password: z.string().min(1),
    })

    const result = schema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: errors[400]
        }, 400);
    }

    const { userCode, password } = result.data;

    let user;
    try {

        user = await getUserByCode(userCode);
        if (!user) {
            return c.json({
                error: errors[401]
            }, 401);
        }
    } catch (e) {
        
        logger.error("Error fetching user:", e);
        return c.json({
            error: errors[500]
        }, 500);
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
        return c.json({
            error: errors[401]
        }, 401);
    }

    let session;
    try {

        session = await createSession(user);
    } catch(e) {

        logger.error("Error creating session:", e);
        return c.json({
            error: errors[500]
        }, 500);
    }

    setCookie(c, 'sessiontoken', session.sessionToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    })

    return c.json({
        data: {
            token: session.jwtToken,
            expiresAt: session.expiresAt,
        }
    }, 200);
}

export const signOut = async (c: Context) => {
    const sessionToken = getCookie(c, "sessiontoken");
    if (!sessionToken) {
        return c.json({
            error: errors[401]
        }, 401);
    }

    try {

        await invalidateSession(sessionToken);
        setCookie(c, 'sessiontoken', '', {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });
        
        return c.text("OK", 200);
    } catch (error) {

        logger.error("Error invalidating session:", error);
        return c.json({
            error: errors[500]
        }, 500);
    }    
}
