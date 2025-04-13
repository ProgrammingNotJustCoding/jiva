import { Hono } from "hono";
import {
  deleteShift,
  getOngoingShift,
  getSupervisorShifts,
  postShift,
  putShift,
} from "../controllers/shifts.controller.ts";

export const router = new Hono();

router.get("/health", async (c) => {
  return c.text("OK");
});

export const shiftRouter = new Hono();

shiftRouter.post("/", postShift);
shiftRouter.get("/", getSupervisorShifts);
shiftRouter.get("/:id", getOngoingShift);
shiftRouter.put("/:id", putShift);
shiftRouter.delete("/:id", deleteShift);
