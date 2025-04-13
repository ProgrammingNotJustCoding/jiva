import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { env } from './config/env.ts'
import logger from './config/logger.ts'
import { router, documentRouter } from './api/routes/routes.ts'
import loggingMiddleware from './api/middlewares/logging.middleware.ts'
import { initializeBucket } from './services/minio.service.ts'

const app = new Hono()

initializeBucket()
  .then(() => logger.info('MinIO bucket initialized successfully'))
  .catch(err => {
    logger.error('Failed to initialize MinIO bucket:', err);
    logger.warn('Application continuing despite MinIO initialization failure');
  });

app.use(loggingMiddleware)

app.route("/api", router)
app.route("/api/documents", documentRouter) 

app.notFound(async(c) => {
  return c.json({
    status: 404,
    message: 'Not Found',
    prettyMessage: "The requested resource was not found",
  }, 404)
})

serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  logger.info(`Server is running on http://localhost:${info.port}`)
})
