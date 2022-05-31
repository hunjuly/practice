import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { User } from 'lib/types'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(userRoute, sessionOptions)

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    console.log('req.session.user', req.session.user)

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
