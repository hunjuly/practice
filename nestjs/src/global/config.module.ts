import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

export async function createConfigModule() {
    return ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production').required(),
            TYPEORM_TYPE: Joi.string().valid('sqlite', 'mysql').required(),
            SESSION_TYPE: Joi.string().valid('memory', 'redis').required(),
            TYPEORM_ENABLE_SYNC: Joi.boolean().default(false),
            LOG_STORAGE_PATH: Joi.string().required(),
            LOG_STORAGE_DAYS: Joi.number().required()
        })
    })
}
