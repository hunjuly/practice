import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { User } from 'pages/api/user'

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
    console.log('-------------- useUser #0')

    const { data: user, mutate: mutateUser } = useSWR<User>('/api/user')

    console.log('-------------- useUser #0', user)
    console.log('-------------- useUser #1')

    useEffect(() => {
        console.log('-------------- useUser #2')

        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return

        console.log('-------------- useUser #3')

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            console.log('-------------- useUser #4')
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    console.log('-------------- useUser #5')

    return { user, mutateUser }
}
