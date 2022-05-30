import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from 'src/theme'
import createEmotionCache from 'src/createEmotionCache'
import { SWRConfig } from 'swr'
import fetchJson from 'lib/fetchJson'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>hunjuly's practice</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SWRConfig
                    value={{
                        fetcher: fetchJson,
                        onError: (err) => {
                            console.error(err)
                        }
                    }}
                >
                    <Component {...pageProps} />
                </SWRConfig>
            </ThemeProvider>
        </CacheProvider>
    )
}
