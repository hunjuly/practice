import { RequestError } from 'types'

export async function get<T>(path: string): Promise<T> {
    const fullOption = { method: 'GET' }

    const { data } = await request<T>(path, fullOption)

    return data
}

export async function delete_<T>(path: string): Promise<T> {
    const fullOption = { method: 'DELETE' }

    const { data } = await request<T>(path, fullOption)

    return data
}

export async function post<T>(path: string, body: unknown): Promise<T> {
    const fullOption = {
        method: 'POST',
        headers: {
            credentials: 'include',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    const { data } = await request<T>(path, fullOption)

    return data
}

const host = 'http://localhost:4000'
// const host = 'http://hunjuly.iptime.org:4000'
// const host = ''

type ResponseType<T> = { data: T; headers: Headers }

async function request<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
    const url = host + path

    const response = await fetch(url, init)

    const data = await response.json()

    if (response.ok) {
        return { data, headers: response.headers }
    }

    throw new RequestError(data.message ?? response.statusText)
}
