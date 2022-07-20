import React from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserContext, useUserContext } from '../context/UserContext'
import Router from 'next/router'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const user = useUserContext()

    React.useEffect(() => {
        const isGlobalLayout = !Component.getLayout

        if (isGlobalLayout && !user.isLoggedIn) {
            Router.push('/login')
        }
    }, [user.isLoggedIn, user.authToken, Component.getLayout])

    const getLayout =
        Component.getLayout ??
        ((page) => {
            return (
                <div>
                    <div>GLOBAL LAYOUT</div>
                    <div
                        onClick={async (e) => {
                            e.preventDefault()

                            await user.logout()
                        }}
                    >
                        Logout
                    </div>
                    {page}
                </div>
            )
        })

    return getLayout(
        <UserContext.Provider value={user}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
