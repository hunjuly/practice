import { requestMock } from './mock'

export type ResponseType<T> = { data: T; headers: Headers }

type ErrorInfo = {
    message: string
    response: Response
    data: {
        message: string
    }
}

export class RequestError extends Error {
    response: Response
    data: {
        message: string
    }
    constructor({ message, response, data }: ErrorInfo) {
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        this.name = 'RequestError'
        this.response = response
        this.data = data ?? { message: message }
    }
}

class ApiRequest {
    constructor(private readonly hostUrl = '') {}

    public async get<T>(path: string, authCookie?: string): Promise<ResponseType<T>> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        return this.request(path, { method: 'GET', headers })
    }

    public async delete_<T>(path: string, authCookie?: string): Promise<ResponseType<T>> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        return this.request(path, { method: 'DELETE', headers })
    }

    public async post<T>(path: string, body: unknown, authCookie?: string): Promise<ResponseType<T>> {
        const headers = authCookie ? { cookie: authCookie } : undefined

        const option = {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        return this.request(path, option)
    }

    public async request<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
        if (this.hostUrl === 'mock') {
            return requestMock(path, init)
        } else {
            const url = this.hostUrl + path

            const response = await fetch(url, init)

            const data = await response.json()

            if (response.ok) {
                console.log('Server Request -- ', path, init?.method, data, response.headers)
                return { data, headers: response.headers }
            }

            throw new RequestError({ message: response.statusText, response, data })
        }
    }
}

export const serviceApi = new ApiRequest(process.env.BACKEND_URL)
export const localApi = new ApiRequest()

export async function fetcher<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const response = await fetch(input, init)

    const data = await response.json()

    if (response.ok) {
        return data
    }

    throw new RequestError({ message: response.statusText, response, data })
}
