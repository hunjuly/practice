import { ResponseType } from './request'

export async function requestMock<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
    const headers = new HeadersMock()

    return { data: {} as T, headers }
}

class HeadersMock implements Headers {
    get(name: string): string | null {
        return null
    }
    has(name: string): boolean {
        return false
    }
    entries(): IterableIterator<[string, string]> {
        throw new Error('Method not implemented.')
    }
    keys(): IterableIterator<string> {
        throw new Error('Method not implemented.')
    }
    values(): IterableIterator<string> {
        throw new Error('Method not implemented.')
    }
    [Symbol.iterator](): IterableIterator<[string, string]> {
        throw new Error('Method not implemented.')
    }
    append(name: string, value: string): void {
        throw new Error('Method not implemented.')
    }
    delete(name: string): void {
        throw new Error('Method not implemented.')
    }
    set(name: string, value: string): void {
        throw new Error('Method not implemented.')
    }
    forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
        throw new Error('Method not implemented.')
    }
}
