import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { AuthService } from './auth.service'

class Payload {
    id: number
}

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super()
    }
    serializeUser(user: Payload, done: (err: Error, user: Payload) => void) {
        console.log('---------------1', JSON.stringify(user))

        done(null, user)
    }

    deserializeUser(payload: Payload, done: (err: Error, user: Omit<Payload, 'password'>) => void) {
        console.log('---------------2', payload)

        done(null, payload)
    }
}
