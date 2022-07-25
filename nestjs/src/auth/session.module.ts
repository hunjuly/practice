import { exit } from 'process'
import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common'
import * as RedisStore from 'connect-redis'
import * as passport from 'passport'
import * as session from 'express-session'
import { RedisService } from 'src/common/redis.service'
import { ConfigService } from '@nestjs/config'

function createOption(config: ConfigService, redisService: RedisService) {
    type SessionType = 'memory' | 'redis' | undefined

    const type = config.get<SessionType>('SESSION_TYPE')
    const maxAge = config.get<number>('SESSION_MAXAGE_SEC')
    const cookie = { sameSite: true, httpOnly: false, maxAge }

    const common = {
        saveUninitialized: false,
        secret: ['sup3rs3cr3t', 'akjsdfhkladjsfh', 'sfdgkg321'],
        resave: false,
        cookie,
        pauseStream: true
    }

    if (type === 'redis') {
        if (!redisService.isAvailable()) {
            Logger.error('Redis not available.')

            exit(1)
        }

        const store = new (RedisStore(session))({
            client: redisService.getClient(),
            logErrors: true
        })

        Logger.log('using redis session.')

        return { ...common, store }
    } else if (type === 'memory') {
        const nodeEnv = config.get<string>('NODE_ENV')

        if (nodeEnv === 'production') {
            Logger.error('Do not use memory session on production.')

            exit(1)
        }

        Logger.warn('using memory session.')

        return common
    }
}

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
