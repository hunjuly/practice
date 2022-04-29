import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerOptions } from 'typeorm'

type DatabaseType = 'mysql' | 'sqlite' | undefined
const logger = 'advanced-console' as 'advanced-console'
const logging = ['error', 'warn', 'info', 'log'] as LoggerOptions

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.configService.get<string>('NODE_ENV')
        const synchronize = this.configService.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            console.log('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        const type = this.configService.get<DatabaseType>('TYPEORM_TYPE')

        const commonOption = { type, synchronize, autoLoadEntities: true, logger, logging }

        if (type === 'sqlite') {
            console.log('WARNING database connection is not set. using MEMORY DB.')

            return { ...commonOption, database: ':memory:' }
        } else if (type === 'mysql') {
            const host = this.configService.get<string>('TYPEORM_HOST')
            const port = this.configService.get<number>('TYPEORM_PORT')
            const database = this.configService.get<string>('TYPEORM_DATABASE')
            const username = this.configService.get<string>('TYPEORM_USERNAME')
            const password = this.configService.get<string>('TYPEORM_PASSWORD')

            return { ...commonOption, host, port, database, username, password }
        }

        throw new Error(`unknown TYPEORM_TYPE(${type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
    })
}
