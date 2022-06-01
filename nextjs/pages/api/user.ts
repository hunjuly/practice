import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { User } from 'lib/types'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(route, sessionOptions)

async function route(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.user) {
        res.json(req.session.user)
    } else {
        res.json({
            isLoggedIn: false,
            id: '',
            email: '',
            authCookie: ''
        })
    }
}
