enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  default = 'na',
}

class Logger {
  private static isProduction: boolean = import.meta.env.PROD

  private static clog(level: LogLevel, ...args: unknown[]) {
    if (!Logger.isProduction) {
      switch (level) {
        case 'debug':
          console.debug(...args)
          break
        case 'info':
          console.info(...args)
          break
        case 'warn':
          console.warn(...args)
          break
        case 'error':
          console.error(...args)
          break

        default:
          console.log(...args)
          break
      }
    }
  }

  static debug(...args: unknown[]) {
    Logger.clog(LogLevel.debug, ...args)
  }

  static info(...args: unknown[]) {
    Logger.clog(LogLevel.info, ...args)
  }

  static warn(...args: unknown[]) {
    Logger.clog(LogLevel.warn, ...args)
  }

  static error(...args: unknown[]) {
    Logger.clog(LogLevel.error, ...args)
  }

  static log(...args: unknown[]) {
    Logger.clog(LogLevel.default, ...args)
  }

  static mode() {
    return console.log('Logger: ', Logger.isProduction ? 'Production' : 'Development')
  }
}

export default Logger
