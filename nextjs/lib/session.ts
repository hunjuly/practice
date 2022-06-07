import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import type { IronSessionOptions } from 'iron-session'
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'

export function withSessionApiRoute(handler: NextApiHandler): NextApiHandler {
    return withIronSessionApiRoute(handler, option)
}

export function withSessionSsr<P extends withSessionSsrType = withSessionSsrType>(handler: SsrHandler<P>) {
    return withIronSessionSsr(handler, option)
}

type withSessionSsrType = {
    [key: string]: unknown
}

type SsrHandler<P> = (
    context: GetServerSidePropsContext
) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>

const option: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'practice/cookie-name',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    }
}
