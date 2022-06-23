import { LoggerService } from '@nestjs/common'
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
                    level: 'warning'
                }),
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        })
    }

    log(message: any, ...optionalParams: any[]) {
        console.log('USING DEFAULT SESSION')

        this.logger.info(message, optionalParams)
    }

    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, optionalParams)
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, optionalParams)
    }

    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, optionalParams)
    }

    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, optionalParams)
    }
}

// class DevLogger extends ConsoleLogger {
//     warn(...args: [message: any, context?: string]) {
//         // ignore warnings
//     }
// }

export function getLogger(isProduction: boolean): LoggerService {
    // if (isProduction) {
    return new ProdLogger()
    // }

    // return new DevLogger()
}

// @Injectable()
// class MyService {
//   private readonly logger = new Logger(MyService.name);

//   doSomething() {
//     this.logger.log('Doing something...');
//   }
// }
