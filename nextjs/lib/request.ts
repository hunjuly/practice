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

class Request {
    constructor(private host = '') {}

    async request<T>(path: string, init?: RequestInit): Promise<T> {
        const url = this.host + path

        const response = await fetch(url, init)

        const data = await response.json()

        if (response.ok) {
            return data
        }

        throw new RequestError({ message: response.statusText, response, data })
    }

    async get<T>(path: string): Promise<T> {
        return this.request(path, { method: 'GET' })
    }

    async delete_<T>(path: string): Promise<T> {
        return this.request(path, { method: 'DELETE' })
    }

    async post<T>(path: string, body: unknown): Promise<T> {
        const option = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        return this.request(path, option)
    }
}

export const clientSide = new Request()
export const serverSide = new Request(process.env.LOCAL_URL)
