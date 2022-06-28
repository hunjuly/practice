import { Test } from '@nestjs/testing'
import { Injectable, Logger } from '@nestjs/common'
import { MyLogger } from './my-logger'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

@Injectable()
class LogService {
    private readonly logger = new Logger(LogService.name)

    constructor(private doNotUse: MyLogger) {}

    printLog() {
        this.logger.log('Instance Method')

        Logger.log('Static Method')

        this.doNotUse.log('Not Recommended Method.')
    }
}

it('create & using Logger', async () => {
    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                validationSchema: Joi.object({
                    LOG_STORAGE_PATH: Joi.string().default('logs'),
                    LOG_STORAGE_DAYS: Joi.number().default(14)
                })
            })
        ],
        providers: [LogService, MyLogger, ConfigService]
    }).compile()

    module.useLogger(module.get(MyLogger))

    const service = module.get(LogService)

    service.printLog()
})
