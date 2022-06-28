import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import * as RedisStore from 'connect-redis'
import * as session from 'express-session'
import { Logger } from '@nestjs/common'
import { RedisService } from './redis'
import { ConfigService } from '@nestjs/config'
import { MyLogger } from './my-logger'

type SessionType = 'memory' | 'redis' | undefined

@Injectable()
export class SessionService {
    constructor(
        private config: ConfigService,
        private redisService: RedisService // private logger: MyLogger
    ) {}

    createOption() {
        const type = this.config.get<SessionType>('SESSION_TYPE')

        if (type === 'redis') {
            if (this.redisService.isAvailable()) {
                Logger.log('using redis session')

                const store = new (RedisStore(session))({
                    client: this.redisService.getClient(),
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
            const nodeEnv = this.config.get<string>('NODE_ENV')

            if (nodeEnv === 'production') {
                Logger.error('Do not use memory session on production')

                exit(1)
            }

            Logger.log('using memory session')

            return {
                saveUninitialized: false,
                secret: 'sup3rs3cr3t',
                resave: false
            }
        }
    }
}
