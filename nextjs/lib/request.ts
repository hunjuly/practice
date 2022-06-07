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

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        this.name = 'RequestError'
        this.response = response
        this.data = data ?? { message }
    }
}

type RequestOption = { authCookie?: string | undefined }

function makeHeaders(option?: RequestOption) {
    if (option) {
        const headers = option.authCookie ? { cookie: option.authCookie } : undefined

        return headers
    }

    return undefined
}

class Request {
    constructor(private host = '') {}

    async get<T>(path: string, option?: RequestOption): Promise<T> {
        const headers = makeHeaders(option)

        const { data } = await this.request<T>(path, { method: 'GET', headers })

        return data
    }

    async delete_<T>(path: string, option?: RequestOption): Promise<T> {
        const headers = makeHeaders(option)

        const { data } = await this.request<T>(path, { method: 'DELETE', headers })

        return data
    }

    async post<T>(path: string, body: unknown, option?: RequestOption): Promise<T> {
        const headers = makeHeaders(option)

        const fullOption = {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        const { data } = await this.request<T>(path, fullOption)
        console.log('-----------------------', fullOption)

        return data
    }

    async request<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
        if (this.host === 'mock') {
            return requestMock(path, init)
        } else {
            const url = this.host + path

            const response = await fetch(url, init)

            const data = await response.json()

            if (response.ok) {
                console.log('Request -- ', path, init?.method, data, response.headers)
                return { data, headers: response.headers }
            }

            throw new RequestError({ message: response.statusText, response, data })
        }
    }
}

export const clientSide = new Request()
export const serverSide = new Request(process.env.BACKEND_URL)
