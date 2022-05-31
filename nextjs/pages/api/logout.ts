import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { delete_ } from './lib/request'

export default withIronSessionApiRoute(logoutRoute, sessionOptions)

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = req.session.user
    req.session.destroy()

    try {
        await delete_('/auth/logout', session?.authCookie)

        res.json({
            isLoggedIn: false,
            id: '',
            email: '',
            authCookie: ''
        })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
