import { Hono } from "hono";
import { createAccount, signIn, signOut } from "../controllers/auth.controller.ts";

const router = new Hono()

router.get("/health", async(c) => {
    return c.text("OK");
})

router.post("/auth/signin", signIn);
router.post("/auth/create", createAccount);
router.post("/auth/signout", signOut);

export default router
