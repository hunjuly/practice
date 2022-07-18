import React from 'react'
import { post, get, delete_ } from '../common/request'

type User = {
    id: string
    email: string
    cookie: string
}

const saveUser = (value: User | null) => {
    const jsonValue = JSON.stringify(value)

    localStorage.setItem('user', jsonValue)
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
    const [user, setUser] = React.useState<User | null>()

    React.useEffect(() => {
        const run = async () => {
            const user = loadUser()

            setUser(user)
        }

        run()
    }, [])

    const register = async (userId: string, password: string) => {
        const body = { email: userId, password }

        await post('/users', body)
    }

    const login = async (userId: string, password: string) => {
        const body = { email: userId, password }

        const user = await post<User>('/auth', body)

        await saveUser(user)

        setUser(user)
    }

    const logout = async () => {
        try {
            await delete_('/auth')
        } catch (error: any) {}

        setUser(null)
    }

    const email = user ? user.email : null
    const isLoggedIn = user !== null
    const authToken = ''
    return { email, isLoggedIn, authToken, login, logout, register }
}

export type UserContextType = {
    email: string | null
    isLoggedIn: boolean
    authToken: string
    register: (userId: string, password: string) => void
    login: (userId: string, password: string) => void
    logout: () => void
}

const defaultValue = {
    email: null,
    isLoggedIn: false,
    authToken: '',
    register: (_userId: string, _password: string) => {
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
