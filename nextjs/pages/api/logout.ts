import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { nullSession } from 'hooks/useUserSession'
import { serverSide } from 'lib/request'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()

    const option = { authCookie: req.session.user?.authCookie }

    await serverSide.delete_('/auth/logout', option)

    res.json(nullSession)
}
