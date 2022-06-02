import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { FetchError } from 'lib/request'
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
                fetcher,
                onError: (err) => {
                    console.error(err)
                }
            }}
        >
            <Component {...pageProps} />
        </SWRConfig>
    )
}

async function fetcher<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const response = await fetch(input, init)

    const data = await response.json()

    if (response.ok) {
        return data
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data
    })
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
