import 'dotenv/config'
import { ConfigService } from '@nestjs/config'
import { Logger as OrmLogger, QueryRunner } from 'typeorm'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

export class OrmLoggerImpl implements OrmLogger {
    private logger: Logger

    constructor(config: ConfigService) {
        const storagePath = config.get<string>('LOG_STORAGE_PATH')
        const storageDays = config.get<number>('LOG_STORAGE_DAYS')

        Path.mkdir(storagePath)

        const option = {
            dirname: storagePath,
            datePattern: 'YYYY-MM-DD, HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: storageDays + 'd',
            createSymlink: true,
            format: format.combine(format.timestamp(), format.prettyPrint())
        }

        const all = new DailyRotateFile({
            ...option,
            filename: 'db, %DATE%.log'
        })

        const errors = new DailyRotateFile({
            ...option,
            filename: 'db, %DATE%.error.log',
            level: 'error'
        })

        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors],
            exceptionHandlers: [errors]
        })
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.verbose(query, parameters)
    }
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (error instanceof Error) {
            this.logger.error(error.message, query, parameters)
        } else {
            this.logger.error(error, query, parameters)
        }
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.warn(query, time, parameters)
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.info(message)
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.info(message)
    }
    log(level: 'warn' | 'info' | 'log', message: any, queryRunner?: QueryRunner) {
        this.logger.log(level, message)
    }
}
