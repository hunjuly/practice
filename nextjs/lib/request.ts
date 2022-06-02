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

export async function get(path: string, authCookie?: string): Promise<ResponseType> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    return request(path, { method: 'GET', headers })
}

export async function delete_(path: string, authCookie?: string): Promise<ResponseType> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    return request(path, { method: 'DELETE', headers })
}

export async function post(path: string, body: unknown, authCookie?: string): Promise<ResponseType> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    const option = {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    return request(path, option)
}

async function request(path: string, init?: RequestInit): Promise<ResponseType> {
    const backendUrl = process.env.BACKEND_URL as string

    console.log('REQUEST - ', path, init?.body, init?.headers)

    if (backendUrl === 'mock') {
        return requestMock(path, init)
    } else {
        const url = backendUrl + path

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
