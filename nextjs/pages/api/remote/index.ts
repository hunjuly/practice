import { requestMock } from './mock'
import { RequestError } from 'lib/request'

export type ResponseType<T> = { data: T; headers: Headers }

export async function get<T>(path: string, authCookie?: string): Promise<ResponseType<T>> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    return request(path, { method: 'GET', headers })
}

export async function delete_<T>(path: string, authCookie?: string): Promise<ResponseType<T>> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    return request(path, { method: 'DELETE', headers })
}

export async function post<T>(path: string, body: unknown, authCookie?: string): Promise<ResponseType<T>> {
    const headers = authCookie ? { cookie: authCookie } : undefined

    const option = {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    return request(path, option)
}

async function request<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
    const host = process.env.BACKEND_URL

    if (host === 'mock') {
        return requestMock(path, init)
    } else {
        const url = host + path

        const response = await fetch(url, init)

        const data = await response.json()

        if (response.ok) {
            console.log('Remote Request -- ', path, init?.method, data, response.headers)
            return { data, headers: response.headers }
        }

        throw new RequestError({ message: response.statusText, response, data })
    }
}
