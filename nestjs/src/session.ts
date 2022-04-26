import { DynamicModule, Injectable, Module, OnModuleInit, Provider } from '@nestjs/common'
import * as Redis from 'redis'
import * as RedisStore from 'connect-redis'
import { RedisClient } from 'redis'
import * as session from 'express-session'
import { ModuleRef } from '@nestjs/core'

const REDIS = Symbol('AUTH:REDIS')
const host = process.env['REDIS_HOST']
const portText = process.env['REDIS_PORT']
const port = portText ? parseInt(portText) : undefined

@Module({})
class SessionModule {
    static forRoot(): DynamicModule {
        const providers: Provider[] = [SessionService]
        const exports: any[] = [SessionService]

        if (host && port) {
            providers.push({
                provide: REDIS,
                useValue: Redis.createClient({ port, host })
            })

            exports.push(REDIS)
        }

        return {
            module: SessionModule,
            providers: providers,
            exports: exports
        }
    }
}

export function createSessionModule() {
    return SessionModule.forRoot()
}

@Injectable()
export class SessionService implements OnModuleInit {
    constructor(private moduleRef: ModuleRef) {
        this.redis = undefined
    }

    private redis: RedisClient | undefined

    onModuleInit() {
        if (host) {
            this.redis = this.moduleRef.get(REDIS)
        }
    }

    getOpt() {
        if (this.redis)
            return {
                store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
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

        const sessionOpt2 = {
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false
        }

        return sessionOpt2
    }
}
