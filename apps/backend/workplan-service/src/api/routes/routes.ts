import { Hono } from "hono";

export const router = new Hono();

router.get("/health", (c) => {
  return c.text("OK", 200);
});
