import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

export type UserSession = {
    isLoggedIn: boolean
    id: string
    email: string
    authCookie: string
}

declare module 'iron-session' {
    interface IronSessionData {
        user?: UserSession
    }
}

export function useUserSession({ redirectTo = '', redirectIfFound = false } = {}) {
    const { data: user, mutate: mutateUser } = useSWR<UserSession>('/api/user')

    useEffect(() => {
        if (!redirectTo || !user) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, mutateUser }
}
