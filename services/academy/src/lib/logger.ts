// Simple structured logger for Academy API

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = process.env.LOG_LEVEL as LogLevel ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatMessage = (level: LogLevel, message: string, meta?: LogMeta): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level.toUpperCase()}] [academy-api]: ${message}${metaStr}`;
};

const logger = {
  debug: (message: string, meta?: LogMeta) => {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta));
  },
  info: (message: string, meta?: LogMeta) => {
    if (shouldLog('info')) console.info(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: LogMeta) => {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, error?: Error | unknown) => {
    if (shouldLog('error')) {
      if (error instanceof Error) {
        console.error(formatMessage('error', message, {
          errorMessage: error.message,
          stack: error.stack
        }));
      } else {
        console.error(formatMessage('error', message, { error }));
      }
    }
  },
};

export default logger;
export const logInfo = logger.info;
export const logError = logger.error;
export const logWarn = logger.warn;
export const logDebug = logger.debug;
