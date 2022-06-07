import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { nullSession } from 'hooks/useUserSession'
import * as remote from './remote'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    const userSession = req.session.user

    req.session.destroy()

    try {
        await remote.delete_('/auth/logout', userSession?.authCookie)

        res.json(nullSession)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
