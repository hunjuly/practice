import { NotFoundException } from '@nestjs/common'

export class InternalError extends Error {}

export class Expect {
    static found(con: any, message?: string) {
        if (!con) throw new NotFoundException(message)
    }
}

export class Assert {
    static truthy(con: any, message: string) {
        if (!con) throw new InternalError(message)
    }

    static empty(con: any, message: string) {
        if (!con) throw new InternalError(message)
    }
}
