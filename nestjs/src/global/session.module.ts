import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import * as passport from 'passport'
import * as session from 'express-session'
import { createOption } from './session'
import { RedisService } from './redis'
import { ConfigService } from '@nestjs/config'

@Module({
    providers: [RedisService]
})
export class SessionModule implements NestModule {
    constructor(private config: ConfigService, private redisService: RedisService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session(createOption(this.config, this.redisService)),
                passport.initialize(),
                passport.session()
            )
            .forRoutes('*')
    }
}
