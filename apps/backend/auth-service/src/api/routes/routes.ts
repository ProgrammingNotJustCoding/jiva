import { Hono } from "hono";
import {
  createAccount,
  signIn,
  verifyAuth,
} from "../controllers/auth.controller.ts";

const router = new Hono();

router.get("/health", async (c) => {
  return c.text("OK");
});

router.post("/auth/signin", signIn);
router.post("/auth/create", createAccount);
router.get("/auth/verify", verifyAuth);

export default router;
