import { LoggerService } from '@nestjs/common'
import { ConsoleLogger } from '@nestjs/common'
import * as winston from 'winston'

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

class ProdLogger implements LoggerService {
    private logger: winston.Logger

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: 'error'
                }),
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        })
    }
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        this.logger.info(message, optionalParams)
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {}

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {}

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) {}

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) {}
}

class DevLogger extends ConsoleLogger {
    warn(...args: [message: any, context?: string]) {
        // ignore warnings
    }
}

export function getLogger(isProduction: boolean): LoggerService {
    if (isProduction) {
        return new ProdLogger()
    }

    return new DevLogger()
}

// @Injectable()
// class MyService {
//   private readonly logger = new Logger(MyService.name);

//   doSomething() {
//     this.logger.log('Doing something...');
//   }
// }
