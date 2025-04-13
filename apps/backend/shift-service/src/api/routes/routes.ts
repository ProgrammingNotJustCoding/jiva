import { Hono } from "hono";
import {
  deleteShift,
  getOngoingShift,
  getSupervisorShifts,
  postShift,
  putShift,
} from "../controllers/shifts.controller.ts";
import {
  deleteLog,
  getShiftLogs,
  getShiftWorkerLogs,
  postLog,
  putLog,
} from "../controllers/logs.controller.ts";
import {
  deleteUserDetails,
  getUserDetails,
  postUserDetails,
  putUserDetails,
} from "../controllers/details.controller.ts";

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

export const logRouter = new Hono();

logRouter.post("/", postLog);
logRouter.get("/", getShiftLogs);
logRouter.get("/:id", getShiftWorkerLogs);
logRouter.put("/:id", putLog);
logRouter.delete("/:id", deleteLog);

export const detailsRouter = new Hono();

detailsRouter.post("/", postUserDetails);
detailsRouter.get("/:id", getUserDetails);
detailsRouter.put("/:id", putUserDetails);
detailsRouter.delete("/:id", deleteUserDetails);
