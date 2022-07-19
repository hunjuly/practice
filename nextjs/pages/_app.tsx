import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserContext, useUserContext } from '../context/UserContext'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const user = useUserContext()

    const getLayout =
        Component.getLayout ??
        ((page) => {
            return <div>GLOBAL LAYOUT {page}</div>
        })

    return getLayout(
        <UserContext.Provider value={user}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
