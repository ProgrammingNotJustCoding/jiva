import type { Context, Next } from "hono";

import logger from "../../config/logger.js";

const loggingMiddleware = async (c: Context, next: Next) => {
  const startTime = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const status = c.res.status;
  const duration = Date.now() - startTime;

  let message = "";
  if (c.res.headers.get("content-type")?.includes("application/json")) {
    try {
      const responseClone = c.res.clone();
      const body = await responseClone.json();
      message = body.message || "";
    } catch (error) {
      message = "Failed to parse JSON response";
    }
  }

  if (status >= 400) {
    logger.error(`${method} ${path}: ${status} - ${message}`);
  } else if (status >= 300) {
    logger.warn(`${method} ${path}: ${status} - ${message}`);
  } else {
    logger.info(`${method} ${path}: ${status} - ${duration}ms`);
  }
};

export default loggingMiddleware;
