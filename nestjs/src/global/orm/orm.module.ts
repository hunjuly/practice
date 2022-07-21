import 'dotenv/config'
import { Injectable } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { createLogger } from '../logger'
import { OrmLogger } from './orm-logger'

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private logger: OrmLogger

    async onModuleInit() {}
    async onModuleDestroy() {
        await this.logger.close()
    }

    constructor(private config: ConfigService) {
        const option = {
            storagePath: config.get<string>('LOG_STORAGE_PATH'),
            storageDays: config.get<number>('LOG_STORAGE_DAYS'),
            fileLevel: config.get<string>('LOG_FILE_LEVEL'),
            consoleLevel: config.get<string>('LOG_CONSOLE_LEVEL'),
            context: 'orm'
        }

        const winston = createLogger(option)

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

        const common = {
            type: this.config.get<DatabaseType>('TYPEORM_TYPE'),
            synchronize,
            autoLoadEntities: true,
            logger: this.logger,
            database: this.config.get<string>('TYPEORM_DATABASE')
        }

        if (common.type === 'sqlite') {
            Logger.warn('database connection is not set. using MEMORY DB.')

            return common
        } else if (common.type === 'mysql') {
            const host = this.config.get<string>('TYPEORM_HOST')
            const port = this.config.get<number>('TYPEORM_PORT')
            const username = this.config.get<string>('TYPEORM_USERNAME')
            const password = this.config.get<string>('TYPEORM_PASSWORD')

            return { ...common, host, port, username, password }
        }

        throw new Error(`unknown TYPEORM_TYPE(${common.type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
    })
}
