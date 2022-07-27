import { NotFoundException } from '@nestjs/common'

export class InternalError extends Error {}

declare global {
    const Expect: {
        found(con: any, message?: string)
    }

    const Assert: {
        truthy(con: any, message: string)
        empty(con: any, message: string)
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any

class Expect {
    static found(con: any, message?: string) {
        if (!con) throw new NotFoundException(message)
    }
}
g.Expect = Expect

class Assert {
    static truthy(con: any, message: string) {
        if (!con) throw new InternalError(message)
    }

    static empty(con: any, message: string) {
        if (con) throw new InternalError(message)
    }
}
g.Assert = Assert
