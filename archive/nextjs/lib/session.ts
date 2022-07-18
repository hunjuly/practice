import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import type { IronSessionOptions } from 'iron-session'
import { GetServerSidePropsResult, NextApiHandler } from 'next'
import { serverSide } from 'lib/request'
import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { ServerResponse } from 'http'

const option: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'practice/cookie-name',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    }
}

export function withSessionApi(handler: NextApiHandler): NextApiHandler {
    return withIronSessionApiRoute(handler, option)
}

type withSessionSsrType = {
    [key: string]: unknown
}

type SsrHandler<P> = (request: {
    get: <T>(path: string) => Promise<T>
    delete_: <T>(path: string) => Promise<T>
    post: <T>(path: string, body: unknown) => Promise<T>
    // req: IncomingMessage & { cookies: NextApiRequestCookies }
    // res: ServerResponse
    isLoggedIn: boolean
}) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>

export function withSessionSsr<P extends withSessionSsrType = withSessionSsrType>(handler: SsrHandler<P>) {
    return withIronSessionSsr(async (context) => {
        const get = <T>(path: string) => {
            const option = { authCookie: context.req.session.user?.authCookie }
            return serverSide.get<T>(path, option)
        }
        const delete_ = <T>(path: string) => {
            const option = { authCookie: context.req.session.user?.authCookie }
            return serverSide.delete_<T>(path, option)
        }
        const post = <T>(path: string, body: unknown) => {
            const option = { authCookie: context.req.session.user?.authCookie }
            return serverSide.post<T>(path, body, option)
        }

        // return handler({ get, delete_, post, req: context.req, res: context.res })
        return handler({ get, delete_, post, isLoggedIn: true })
    }, option)
}