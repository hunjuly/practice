import { exit } from 'process'
import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common'
import * as RedisStore from 'connect-redis'
import * as passport from 'passport'
import * as session from 'express-session'
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

type SessionType = 'memory' | 'redis' | undefined

export function createOption(config: ConfigService, redisService: RedisService) {
    const type = config.get<SessionType>('SESSION_TYPE')

    if (type === 'redis') {
        if (redisService.isAvailable()) {
            Logger.log('using redis session')

            const store = new (RedisStore(session))({
                client: redisService.getClient(),
                logErrors: true
            })

            const cookie = { sameSite: true, httpOnly: false, maxAge: 60000 }

            return {
                saveUninitialized: false,
                secret: 'sup3rs3cr3t',
                resave: false,
                store,
                cookie,
                pauseStream: true
            }
        }
    } else if (type === 'memory') {
        const nodeEnv = config.get<string>('NODE_ENV')

        if (nodeEnv === 'production') {
            Logger.error('Do not use memory session on production')

            exit(1)
        }

        Logger.warn('using memory session')

        return {
            saveUninitialized: false,
            secret: 'sup3rs3cr3t',
            resave: false
        }
    }
}
