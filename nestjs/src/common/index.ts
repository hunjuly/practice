export * from './Path_'
export * from './utils'
export * from './pagination'
export * from './File'
export * from './config.module'
export * from './exceptions'

declare global {
    function notUsed(...args): void
}

const g = global as any

g.notUsed = (..._args) => {}
