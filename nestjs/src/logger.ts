import { LoggerService } from '@nestjs/common'
import { ConsoleLogger } from '@nestjs/common'

class DevLogger extends ConsoleLogger {
    warn(...args: [message: any, context?: string]) {
        // ignore warnings
    }
}

class ProdLogger implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {}

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

export function getLogger(): LoggerService {
    if (process.env.NODE_ENV === 'production') {
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
