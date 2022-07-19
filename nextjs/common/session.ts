import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type withSessionSsrType = {
    [key: string]: unknown
}

type SsrHandler<P> = (request: {
    get: <T>(path: string) => Promise<T>
}) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>

export function withSessionSsr<P extends withSessionSsrType = withSessionSsrType>(handler: SsrHandler<P>) {
    return async (context: GetServerSidePropsContext) => {
        const get = async <T>(path: string): Promise<T> => {
            const headers = context.req.headers.cookie ? { cookie: context.req.headers.cookie } : undefined

            const option = {
                method: 'GET',
                headers
            }

            const host = 'http://localhost:4000'
            const url = host + '/users'

            const response = await fetch(url, option)

            const data = await response.json()

            return data
        }

        return handler({ get })
    }
}
