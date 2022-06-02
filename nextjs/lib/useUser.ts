import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { User } from './session'

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
    const { data: user, mutate: mutateUser } = useSWR<User>('/api/user')

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

// const fetcher = (url, token) =>
//     axios
//       .get(url, { headers: { Authorization: "Bearer " + token } })
//       .then((res) => res.data);

// const { data, error } = useSWR(
//   [`http://localhost:8000/api/v1/users/get-avatar`, auth.token],
//   fetcher
// );
