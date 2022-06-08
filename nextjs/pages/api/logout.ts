import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { nullSession } from 'hooks/useUserSession'
import { serverSide } from 'lib/request'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        req.session.destroy()

        const option = { authCookie: req.session.user?.authCookie }

        await serverSide.delete_('/auth', option)
    } catch (error) {
        const message = (error as Error).message

        console.log('An unexpected error happened but ignored.', message)
    }

    res.json(nullSession)
}
