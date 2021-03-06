import { GetServerSidePropsContext as PropsContext, GetServerSidePropsResult as PropsResult } from 'next'
import { GetServerSideProps as Props } from 'next'

type PropsType = {
    [key: string]: unknown
}

type SsrHandler<P> = (request: {
    get: <T>(path: string) => Promise<T>
}) => PropsResult<P> | Promise<PropsResult<P>>

export function getServerSideWithCookie<P extends PropsType>(handler: SsrHandler<P>): Props {
    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) throw new Error('missing BACKEND_URL')

    return async (context: PropsContext) => {
        const get = async <T>(path: string): Promise<T> => {
            const headers = context.req.headers.cookie ? { cookie: context.req.headers.cookie } : undefined

            const option = { method: 'GET', headers }

            const url = backendUrl + '/users'

            const response = await fetch(url, option)

            const data = await response.json()

            return data
        }

        return handler({ get })
    }
}
