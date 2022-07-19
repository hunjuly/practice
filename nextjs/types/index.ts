export class RequestError extends Error {
    constructor(message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        this.name = 'RequestError'
    }
}

export type LoginInfo = {
    id: string
    email: string
}

export type User = {
    id: string
    email: string
    isActive: boolean
    role: string
}

export type PaginatedResponse<T> = {
    total: number
    limit: number
    offset: number
    items: T[]
}

export const zeroItems = {
    total: 0,
    limit: 0,
    offset: 0,
    items: []
}
