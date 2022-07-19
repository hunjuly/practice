import React from 'react'

type User = {
    id: string
    email: string
    cookie: string
}

type RegisterValue = {
    firstName: string
    lastName: string
    email: string
    password: string
}

const saveUser = (value: User | null) => {
    if (value) {
        const jsonValue = JSON.stringify(value)

        localStorage.setItem('user', jsonValue)
    } else {
        localStorage.removeItem('user')
    }
}

const loadUser = () => {
    try {
        const jsonValue = localStorage.getItem('user')

        if (jsonValue) {
            return JSON.parse(jsonValue) as User
        }
    } catch (e) {}

    return null
}

export function useUserContext() {
    const [user, setUser] = React.useState<User | null>(null)

    React.useEffect(() => {
        const run = async () => {
            const user = loadUser()

            setUser(user)
        }

        run()
    }, [])

    const register = async (body: RegisterValue) => {
        // const body = { email: userId, password }

        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const response = await fetch('/api/register', option)

        const data = await response.json()

        if (response.ok) {
            await saveUser(user)

            setUser(user)
        } else {
            throw new RequestError(data.message)
        }
    }

    const login = async (userId: string, password: string) => {
        const body = { email: userId, password }

        const option = {
            method: 'POST',
            headers: {
                credentials: 'include',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const response = await fetch('/api/login', option)

        const data = await response.json()

        if (response.ok) {
            await saveUser(user)

            setUser(user)
        } else {
            throw new RequestError(data.message)
        }
    }

    const logout = async () => {
        const option = { method: 'DELETE' }

        const response = await fetch('/api/logout', option)

        if (!response.ok) {
            console.warn('logout failed')
        }

        await saveUser(null)

        setUser(null)
    }

    return {
        email: user ? user.email : null,
        isLoggedIn: user !== null,
        authToken: '',
        register,
        login,
        logout
    }
}

export type UserContextType = {
    email: string | null
    isLoggedIn: boolean
    authToken: string
    register: (body: RegisterValue) => void
    login: (userId: string, password: string) => void
    logout: () => void
}

const defaultValue = {
    email: null,
    isLoggedIn: false,
    authToken: '',
    register: (_body: RegisterValue) => {
        alert('wrong register')
    },
    login: (_userId: string, _password: string) => {
        alert('wrong login')
    },
    logout: () => {
        alert('wrong logout')
    }
} as UserContextType

export const UserContext = React.createContext(defaultValue)

export class RequestError extends Error {
    constructor(message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        this.name = 'RequestError'
    }
}
