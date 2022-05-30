import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export type User = {
    isLoggedIn: boolean
    id: string
    email: string
    cookie: string
}

export default withIronSessionApiRoute(userRoute, sessionOptions)

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.user) {
        res.json({
            ...req.session.user,
            isLoggedIn: true
        })
    } else {
        res.json({
            isLoggedIn: false,
            id: '',
            email: '',
            cookie: ''
        })
    }
}
