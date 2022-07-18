import React from 'react'
import Router from 'next/router'
import { UserContext } from '../context/UserContext'

type RedirectTo = {
    redirectTo: {
        ifLoggedIn?: string
        ifLoggedOut?: string
    }
}

export function useUser({ redirectTo }: RedirectTo) {
    const user = React.useContext(UserContext)

    React.useEffect(() => {
        alert(JSON.stringify(user))

        if (user.isLoggedIn) {
            if (redirectTo.ifLoggedIn) {
                Router.push(redirectTo.ifLoggedIn)
            }
        } else {
            if (redirectTo.ifLoggedOut) {
                Router.push(redirectTo.ifLoggedOut)
            }
        }
    }, [user])

    return user
}
