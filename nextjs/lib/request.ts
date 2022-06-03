import { requestMock } from './mock'

export type ResponseType = { data: unknown; headers: Headers }

export class FetchError extends Error {
    response: Response
    data: {
        message: string
    }
    constructor({
        message,
        response,
        data
    }: {
        message: string
        response: Response
        data: {
            message: string
        }
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }

        this.name = 'FetchError'
        this.response = response
        this.data = data ?? { message: message }
    }
}

class RequestRest {
    constructor(private readonly hostUrl = '') {}

    public async get(path: string, authCookie?: string): Promise<ResponseType> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        return this.request(path, { method: 'GET', headers })
    }

    public async delete_(path: string, authCookie?: string): Promise<ResponseType> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        return this.request(path, { method: 'DELETE', headers })
    }

    public async post(path: string, body: unknown, authCookie?: string): Promise<ResponseType> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        const option = {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        return this.request(path, option)
    }

    public async request(path: string, init?: RequestInit): Promise<ResponseType> {
        console.log('REQUEST - ', path, init?.body, init?.headers)

        if (this.hostUrl === 'mock') {
            return requestMock(path, init)
        } else {
            const url = this.hostUrl + path

            const response = await fetch(url, init)

            const data = await response.json()

            if (response.ok) {
                console.log('RESPONSE OK - ', data, response.headers)
                return { data, headers: response.headers }
            }

            console.log('RESPONSE ERROR- ', response.statusText)

            throw new FetchError({ message: response.statusText, response, data })
        }
    }
}

const backendUrl = process.env.BACKEND_URL as string
