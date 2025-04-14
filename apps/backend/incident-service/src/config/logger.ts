import pinoModule from "pino"
import { env } from "./env.ts"

const pino = pinoModule.default || pinoModule

const level = env.NODE_ENV === "production" ? "info" : "debug"

const logger = pino({
  level,
  transport: env.NODE_ENV === "development"
  ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    }
  } : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
})

export const getLogger = (name: string) => {
  return logger.child({ name })
}

export default logger;
