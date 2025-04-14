import { Hono } from "hono";
import {
  getIncidentWorkplan,
  postWorkplan,
} from "../controllers/workplans.controller.ts";
import {
  getIncompleteTasks,
  getWorkerTasks,
  getWorkplanWorkers,
} from "../controllers/tasks.controller.ts";

export const router = new Hono();

router.get("/health", (c) => {
  return c.text("OK", 200);
});

export const workplanRouter = new Hono();

workplanRouter.post("/", postWorkplan);
workplanRouter.get("/:incidentId", getIncidentWorkplan);

export const tasksRouter = new Hono();

tasksRouter.get("/workers/:workerId", getWorkerTasks);
tasksRouter.get("/incomplete/:workplanId", getIncompleteTasks);
tasksRouter.get("/:workplanId", getWorkplanWorkers);
