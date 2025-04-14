import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { router, tasksRouter, workplanRouter } from "./api/routes/routes.ts";
import { env } from "./config/env.ts";
import logger from "./config/logger.ts";
import loggingMiddleware from "./api/middlewares/logging.middleware.ts";

const app = new Hono();

app.use(loggingMiddleware);

app.route("/api", router);
app.route("/api/workplans", workplanRouter);
app.route("/api/tasks", tasksRouter);

app.notFound(async (c) => {
  return c.json(
    {
      status: 404,
      message: "Not Found",
      prettyMessage: "The requested resource was not found",
    },
    404,
  );
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  },
);
