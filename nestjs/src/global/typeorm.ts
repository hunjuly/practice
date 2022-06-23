import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { LoggerOptions } from 'typeorm'
import { MyLogger } from 'src/common'

type DatabaseType = 'mysql' | 'sqlite' | undefined
const logger = 'advanced-console' as 'advanced-console'
const logging = ['error', 'warn', 'info', 'log'] as LoggerOptions

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService, private logger: MyLogger) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.configService.get<string>('NODE_ENV')
        const synchronize = this.configService.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            this.logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        const type = this.configService.get<DatabaseType>('TYPEORM_TYPE')
        const database = this.configService.get<string>('TYPEORM_DATABASE')

        // TODO 여기도 logger 설정해야 한다.
        const common = { type, synchronize, autoLoadEntities: true, logger, logging, database }

        if (type === 'sqlite') {
            this.logger.warn('WARNING database connection is not set. using MEMORY DB.')

            return common
        } else if (type === 'mysql') {
            const host = this.configService.get<string>('TYPEORM_HOST')
            const port = this.configService.get<number>('TYPEORM_PORT')
            const username = this.configService.get<string>('TYPEORM_USERNAME')
            const password = this.configService.get<string>('TYPEORM_PASSWORD')

            return { ...common, host, port, database, username, password }
        }

        throw new Error(`unknown TYPEORM_TYPE(${type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
        extraProviders: [MyLogger]
    })
}
