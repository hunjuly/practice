import { Injectable } from '@nestjs/common'
import { Logger as IOrmLogger, QueryRunner } from 'typeorm'
import * as winston from 'winston'

@Injectable()
export class OrmLogger implements IOrmLogger {
    constructor(private logger: winston.Logger) {}

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
