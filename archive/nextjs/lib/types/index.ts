export type LoginInfo = {
    id: string
    email: string
}

export type User = {
    id: string
    email: string
    isActive: boolean
    role: string
}

export type PaginatedResponse<T> = {
    total: number
    limit: number
    offset: number
    items: T[]
}
