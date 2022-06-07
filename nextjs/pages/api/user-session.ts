import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { UserSession, nullSession } from 'hooks/useUserSession'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse<UserSession>) {
    if (req.session.user) {
        res.json(req.session.user)
    } else {
        res.json(nullSession)
    }
}
