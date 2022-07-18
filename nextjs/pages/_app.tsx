import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserContext, useUserContext } from '../context/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
    const user = useUserContext()

    return (
        <UserContext.Provider value={user}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
