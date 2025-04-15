import { Hono } from "hono";
import {
  getShiftIncidents,
  postIncident,
  updateIncident,
} from "../controllers/incidents.controller.ts";
import { generateReportController } from "../controllers/report.controller.ts";

export const router = new Hono();

router.get("/health", async (c) => {
  return c.text("OK");
});

export const incidentRouter = new Hono();

incidentRouter.post("/", postIncident);
incidentRouter.get("/:id", getShiftIncidents);
incidentRouter.put("/:id", updateIncident);

export const reportRouter = new Hono();

reportRouter.get("/:id", generateReportController);
