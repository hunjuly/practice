import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { AuthService } from './auth.service'

class Payload {
    id: string
}

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super()
    }
    serializeUser(user: Payload, done: (err: Error, user: Payload) => void) {
        done(null, user)
    }

    deserializeUser(payload: Payload, done: (err: Error, user: Payload) => void) {
        done(null, payload)
    }
}
