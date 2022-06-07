import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { serverSide } from 'lib/request'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body

    const option = { authCookie: req.session.user?.authCookie }

    await serverSide.post('/users', body, option)

    res.json({ message: 'done' })
}
