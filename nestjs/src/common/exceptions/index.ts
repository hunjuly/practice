import { NotFoundException } from '@nestjs/common'
import { InternalError } from './internal-error'

export class Expect {
    static found(con: any, message?: string) {
        if (!con) throw new NotFoundException(message)
    }
}

export class Assert {
    static truthy(con: any, message: string) {
        if (!con) throw new InternalError(message)
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchArray(expected): CustomMatcherResult
        }
    }
}

expect.extend({
    toMatchArray(actual: any[], expectedList: any[]) {
        let pass = true

        for (const expected of expectedList) {
            pass = this.equals(actual, expect.arrayContaining([expect.objectContaining(expected)]))

            if (!pass) break
        }

        return {
            pass,
            message: () =>
                `expected ${this.utils.printReceived(
                    actual
                )} not to contain object ${this.utils.printExpected(expectedList)}`
        }
    }
})
