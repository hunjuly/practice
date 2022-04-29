import { Injectable } from '@nestjs/common'
import * as RedisStore from 'connect-redis'
import * as session from 'express-session'
import { RedisService } from './redis'

@Injectable()
export class SessionService {
    constructor(private redisService: RedisService) {}

    getOpt() {
        const common = { saveUninitialized: false, secret: 'sup3rs3cr3t', resave: false }

        if (this.redisService.isAvailable()) {
            console.log('USING REDIS SESSION')

            const store = new (RedisStore(session))({
                client: this.redisService.getClient(),
                logErrors: true
            })

            const cookie = { sameSite: true, httpOnly: false, maxAge: 60000 }

            return { ...common, store, cookie, pauseStream: true }
        } else {
            console.log('USING DEFAULT SESSION')

            return common
        }
    }
}
