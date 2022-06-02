import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute, User } from 'lib/session'

export default withSessionApiRoute(route)

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
