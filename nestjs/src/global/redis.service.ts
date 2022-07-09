import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Redis from 'redis'
import { RedisClient } from 'redis'

@Injectable()
export class RedisService {
    private client: RedisClient | undefined

    constructor(private config: ConfigService) {
        const host = this.config.get<string>('REDIS_HOST')
        const port = this.config.get<number>('REDIS_PORT')

        if (host && port) {
            this.client = Redis.createClient({ host, port })
        } else {
            this.client = undefined
        }
    }

    getClient() {
        return this.client
    }

    isAvailable() {
        return this.client !== undefined
    }
}
