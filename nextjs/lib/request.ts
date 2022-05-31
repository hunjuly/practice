import { FetchError } from 'lib/types'

export async function request<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const response = await fetch(input, init)

    const data = await response.json()

    if (response.ok) {
        return data
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data
    })
}

export async function get<JSON = unknown>(path: string): Promise<JSON> {
    return request(path, { method: 'GET' })
}

export async function delete_<JSON = unknown>(path: string): Promise<JSON> {
    return request(path, { method: 'DELETE' })
}

export async function post<JSON = unknown>(path: string, body: unknown): Promise<JSON> {
    const option = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    return request(path, option)
}
