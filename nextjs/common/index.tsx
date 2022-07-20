export * from './session'

export function sleep(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}
