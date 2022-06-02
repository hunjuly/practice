import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { UserSession } from 'hooks/useUserSession'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse<UserSession>) {
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
