import 'dotenv/config'
import { Injectable } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { createLogger } from './logger'
import { Logger as IOrmLogger, QueryRunner } from 'typeorm'
import * as winston from 'winston'

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private logger: OrmLogger

    async onModuleInit() {}
    async onModuleDestroy() {
        await this.logger.close()
    }

    constructor(private config: ConfigService) {
        const storagePath = config.get<string>('LOG_STORAGE_PATH')
        const storageDays = config.get<number>('LOG_STORAGE_DAYS')
        const fileLevel = config.get<string>('LOG_FILE_LEVEL')
        const consoleLevel = config.get<string>('LOG_CONSOLE_LEVEL')
        const context = 'orm'

        const winston = createLogger({
            storagePath,
            storageDays,
            fileLevel,
            consoleLevel,
            context
        })

        this.logger = new OrmLogger(winston)
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.config.get<string>('NODE_ENV')
        const synchronize = this.config.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            Logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        type DatabaseType = 'mysql' | 'sqlite' | undefined

        const type = this.config.get<DatabaseType>('TYPEORM_TYPE')
        const database = this.config.get<string>('TYPEORM_DATABASE')

        const common = {
            type,
            synchronize,
            autoLoadEntities: true,
            logger: this.logger,
            database
        }

        if (type === 'sqlite') {
            Logger.warn('database connection is not set. using MEMORY DB.')

            return common as TypeOrmModuleOptions
        } else if (type === 'mysql') {
            const host = this.config.get<string>('TYPEORM_HOST')
            const port = this.config.get<number>('TYPEORM_PORT')
            const username = this.config.get<string>('TYPEORM_USERNAME')
            const password = this.config.get<string>('TYPEORM_PASSWORD')

            return { ...common, host, port, database, username, password } as MysqlConnectionOptions
        }

        throw new Error(`unknown TYPEORM_TYPE(${type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
    })
}

class OrmLogger implements IOrmLogger {
    constructor(private logger: winston.Logger) {}

    async close() {
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
