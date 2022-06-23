import { Injectable } from '@nestjs/common'
import * as RedisStore from 'connect-redis'
import * as session from 'express-session'
import { Logger } from '@nestjs/common'
import { RedisService } from './redis'
import { ConfigService } from '@nestjs/config'

type SessionType = 'memory' | 'redis' | undefined

@Injectable()
export class SessionService {
    private readonly logger = new Logger(SessionService.name)

    constructor(private configService: ConfigService, private redisService: RedisService) {}

    createOption() {
        const type = this.configService.get<SessionType>('SESSION_TYPE')

        if (type === 'redis') {
            if (this.redisService.isAvailable()) {
                this.logger.log('USING REDIS SESSION')

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
            this.logger.warn('USING DEFAULT SESSION')
            Logger.log('USING DEFAULT SESSION2')

            return {
                saveUninitialized: false,
                secret: 'sup3rs3cr3t',
                resave: false
            }
        }
    }
}
