export class HeadersMock implements Headers {
    constructor(private items: { [key: string]: string }) {}

    get(name: string): string | null {
        return this.items[name]
    }
    has(name: string): boolean {
        return this.items[name] !== undefined
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
