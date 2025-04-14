import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { env } from "./config/env.ts";
import logger from "./config/logger.ts";
import loggingMiddleware from "./api/middlewares/logging.middleware.ts";
import {
  detailsRouter,
  logRouter,
  router,
  shiftRouter,
} from "./api/routes/routes.ts";

const app = new Hono();

app.use(loggingMiddleware);

app.route("/api", router);
app.route("/api/shifts", shiftRouter);
app.route("/api/logs", logRouter);
app.route("/api/details", detailsRouter);

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
