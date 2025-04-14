import { Hono } from "hono";

export const router = new Hono();

router.get("/health", async (c) => {
  return c.text("OK");
});
