import { Injectable, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'
import { Logger as IOrmLogger, QueryRunner } from 'typeorm'

@Injectable()
export default class OrmLogger implements IOrmLogger {
    private logger: Logger
    private storagePath: string
    private storageDays: number

    constructor(private config: ConfigService) {
        this.storagePath = this.config.get<string>('LOG_STORAGE_PATH')
        this.storageDays = this.config.get<number>('LOG_STORAGE_DAYS')

        // onModuleInit() 전에 this.logger를 호출하는 경우도 있다.
        // 생성자에서 this.logger를 초기화 하지 않으면 에러다.
        Path.mkdir(this.storagePath)

        const option = {
            dirname: this.storagePath,
            datePattern: 'YYYY-MM-DD, HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: this.storageDays + 'd',
            createSymlink: true,
            format: format.combine(format.timestamp(), format.prettyPrint())
        }

        const all = new DailyRotateFile({
            ...option,
            symlinkName: 'orm-current.log',
            filename: 'orm-%DATE%h.log'
        })

        const errors = new DailyRotateFile({
            ...option,
            datePattern: 'YYYY-MM-DD',
            maxFiles: null,
            symlinkName: 'orm-errors.log',
            filename: 'orm-%DATE%, err.log',
            level: 'error'
        })

        const dev = new transports.Console({
            format: format.combine(format.colorize({ all: true }), format.simple()),
            level: 'error'
        })

        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors, dev],
            exceptionHandlers: [errors]
        })
    }

    async onModuleInit() {}
    async onModuleDestroy() {
        await this.logger.close()
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
