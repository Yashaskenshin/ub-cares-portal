type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
    private static instance: Logger
    private isEnabled = true

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    setEnable(enabled: boolean) {
        this.isEnabled = enabled
    }

    private log(level: LogLevel, ...args: any[]) {
        if (!this.isEnabled) return

        const timestamp = new Date().toISOString()
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`

        switch (level) {
            case 'info':
                console.log(prefix, ...args)
                break
            case 'warn':
                console.warn(prefix, ...args)
                break
            case 'error':
                console.error(prefix, ...args)
                break
            case 'debug':
                if (import.meta.env.DEV) {
                    console.debug(prefix, ...args)
                }
                break
        }
    }

    info(...args: any[]) { this.log('info', ...args) }
    warn(...args: any[]) { this.log('warn', ...args) }
    error(...args: any[]) { this.log('error', ...args) }
    debug(...args: any[]) { this.log('debug', ...args) }
}

export const logger = Logger.getInstance()
