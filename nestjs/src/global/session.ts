import { exit } from 'process'
import * as RedisStore from 'connect-redis'
import * as session from 'express-session'
import { Logger } from '@nestjs/common'
import { RedisService } from './redis'
import { ConfigService } from '@nestjs/config'

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
