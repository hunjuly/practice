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
    append(_name: string, _value: string): void {
        throw new Error('Method not implemented.')
    }
    delete(_name: string): void {
        throw new Error('Method not implemented.')
    }
    set(_name: string, _value: string): void {
        throw new Error('Method not implemented.')
    }
    forEach(_callbackfn: (value: string, key: string, parent: Headers) => void, _thisArg?: any): void {
        throw new Error('Method not implemented.')
    }
}
