import { LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as winston from 'winston'

export class MyLogger implements LoggerService {
    private logger: winston.Logger

    constructor(private configService: ConfigService) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: 'info'
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
