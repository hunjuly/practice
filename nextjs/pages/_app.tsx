import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { request } from 'lib/request'

import './globals.css'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout =
        Component.getLayout ??
        ((page) => {
            return <div>GLOBAL LAYOUT {page}</div>
        })

    return getLayout(
        <SWRConfig
            value={{
                fetcher: request,
                onError: (err) => {
                    console.error(err)
                }
            }}
        >
            <Component {...pageProps} />
        </SWRConfig>
    )
}
