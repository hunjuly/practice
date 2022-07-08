import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Logger as IOrmLogger, QueryRunner } from 'typeorm'
import * as winston from 'winston'
import { createFileLogger } from './logger'

type DatabaseType = 'mysql' | 'sqlite' | undefined

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useFactory: (config: ConfigService, logger: OrmLogger) => {
            const nodeEnv = config.get<string>('NODE_ENV')
            const synchronize = config.get<boolean>('TYPEORM_ENABLE_SYNC')

            if (nodeEnv === 'production' && synchronize) {
                Logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

                exit(1)
            }

            const type = config.get<DatabaseType>('TYPEORM_TYPE')
            const database = config.get<string>('TYPEORM_DATABASE')

            //  | "all" | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")[];
            const logging = nodeEnv === 'production' ? 'all' : ['error', 'warn']

            const common = {
                type,
                synchronize,
                autoLoadEntities: true,
                logger,
                logging,
                database
            }

            if (type === 'sqlite') {
                Logger.warn('database connection is not set. using MEMORY DB.')

                return common as TypeOrmModuleOptions
            } else if (type === 'mysql') {
                const host = config.get<string>('TYPEORM_HOST')
                const port = config.get<number>('TYPEORM_PORT')
                const username = config.get<string>('TYPEORM_USERNAME')
                const password = config.get<string>('TYPEORM_PASSWORD')

                return { ...common, host, port, database, username, password } as MysqlConnectionOptions
            }

            throw new Error(`unknown TYPEORM_TYPE(${type})`)
        },
        inject: [ConfigService],
        extraProviders: [
            {
                provide: OrmLogger,
                useFactory: (config: ConfigService) => {
                    const storagePath = config.get<string>('LOG_STORAGE_PATH')
                    const storageDays = config.get<number>('LOG_STORAGE_DAYS')

                    const winston = createFileLogger(storagePath, storageDays, 'orm')

                    return new OrmLogger(winston)
                },
                inject: [ConfigService]
            }
        ]
    })
}

// onModuleDestroy()에서 logger.close()를 해야 하기 때문에 @Injectable()을 사용했다.
@Injectable()
class OrmLogger implements IOrmLogger {
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
