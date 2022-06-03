import { NextApiRequest, NextApiResponse } from 'next'
import { serviceApi } from 'lib/request'
import { withSessionApiRoute } from 'lib/session'
import { nullSession } from 'hooks/useUserSession'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    const session = req.session.user

    req.session.destroy()

    try {
        await serviceApi.delete_('/auth/logout', session?.authCookie)

        res.json(nullSession)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
