import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { delete_ } from './lib/request'

export default withIronSessionApiRoute(logoutRoute, sessionOptions)

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        await delete_('/auth/logout')

        req.session.destroy()

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
