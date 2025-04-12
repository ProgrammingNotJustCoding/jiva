import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { env } from './config/env.js'
import logger from './config/logger.js'
import loggingMiddleware from './api/middlewares/logging.middleware.js'
import router from './api/routes/routes.js'

const app = new Hono()

app.use(loggingMiddleware)

app.route("/api", router)

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
