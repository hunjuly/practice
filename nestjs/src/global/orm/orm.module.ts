import 'dotenv/config'
import { Injectable } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { createLogger } from 'src/common'
import { createOptions } from 'typeorm/data-source'
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
        return createOptions(this.logger)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
    })
}
