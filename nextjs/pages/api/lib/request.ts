import { FetchError } from 'lib/types'
import { ResponseType } from './types'
import { requestMock } from './mock'

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

export async function request(path: string, init?: RequestInit): Promise<ResponseType> {
    const backendUrl = process.env.BACKEND_URL as string

    if (backendUrl === 'mock') {
        return requestMock(path, init)
    } else {
        const url = backendUrl + path

        const response = await fetch(url, init)

        const data = await response.json()

        if (response.ok) {
            return { data, headers: response.headers }
        }

        throw new FetchError({ message: response.statusText, response, data })
    }
}
