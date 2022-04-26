import { Module } from '@nestjs/common'
import * as Redis from 'redis'
import * as RedisStore from 'connect-redis'
import { RedisClient } from 'redis'
import * as session from 'express-session'

export const REDIS = Symbol('AUTH:REDIS')

@Module({
    providers: [
        {
            provide: REDIS,
            useValue: Redis.createClient({ port: 6379, host: 'practice.redis' })
        }
    ],
    exports: [REDIS]
})
export class RedisModule {}

export function redisSessionOpt(redis: RedisClient) {
    return {
        store: new (RedisStore(session))({ client: redis, logErrors: true }),
        saveUninitialized: false,
        secret: 'sup3rs3cr3t',
        resave: false,
        cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 60000
        },
        pauseStream: true
    }
}

// docker run --rm -d --name practice.redis --network vscode redis
// docker run --rm -it --network vscode redis redis-cli -h practice.redis
// keys *
// get (key)
