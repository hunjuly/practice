import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { clientSide } from 'lib/request'
import './globals.css'

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout =
        Component.getLayout ??
        ((page) => {
            return <div>GLOBAL LAYOUT {page}</div>
        })

    return getLayout(
        <SWRConfig
            value={{
                fetcher: (path: string) => clientSide.get(path),
                onError: (err) => {
                    console.error(err)
                }
            }}
        >
            <Component {...pageProps} />
        </SWRConfig>
    )
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
