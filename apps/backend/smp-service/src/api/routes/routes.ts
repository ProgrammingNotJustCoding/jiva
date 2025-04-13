import { Hono } from "hono";

const router = new Hono()

router.get("/health", async(c) => {
    return c.text("OK");
})

export default router
