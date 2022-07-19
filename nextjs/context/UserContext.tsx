import React from 'react'
import { RequestError } from 'types'

type User = {
    id: string
    email: string
}

type RegisterValue = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export function useUserContext() {
    const [user, setUser] = React.useState<User | null>(null)

    React.useEffect(() => {
        const load = async () => {
            try {
                const text = localStorage.getItem('user')

                if (text) {
                    const stored = JSON.parse(text) as User

                    setUser(stored)
                }
            } catch (e) {
                setUser(null)
            }
        }

        load()
    }, [])

    React.useEffect(() => {
        const save = async () => {
            if (user) {
                const jsonValue = JSON.stringify(user)

                localStorage.setItem('user', jsonValue)
            } else {
                localStorage.removeItem('user')
            }
        }

        save()
    }, [user])

    const register = async (body: RegisterValue) => {
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const response = await fetch('/api/register', option)

        if (!response.ok) {
            const data = await response.json()
            throw new RequestError(data.message)
        }
    }

    const login = async (email: string, password: string) => {
        const body = { email, password }

        const option = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        const response = await fetch('/api/login', option)

        const data = await response.json()

        if (response.ok) {
            const newUser = data as User

            setUser(newUser)
        } else {
            throw new RequestError(data.message)
        }
    }

    const logout = async () => {
        const option = {
            method: 'DELETE'
        }

        const response = await fetch('/api/logout', option)

        if (!response.ok) {
            console.warn('logout failed')
        }

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
    register: (body: RegisterValue) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const defaultValue = {
    email: null,
    isLoggedIn: false,
    authToken: '',
    register: (_body: RegisterValue) => {
        alert('wrong register')
    },
    login: (_email: string, _password: string) => {
        alert('wrong login')
    },
    logout: () => {
        alert('wrong logout')
    }
} as UserContextType

export const UserContext = React.createContext(defaultValue)
