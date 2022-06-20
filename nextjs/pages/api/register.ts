import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApi } from 'lib/session'
import { serverSide } from 'lib/request'

export default withSessionApi(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const option = { authCookie: req.session.user?.authCookie }

        await serverSide.post('/users', body, option)

        res.json({ message: 'done' })
    } catch (error) {
        const message = (error as Error).message

        res.status(500).json({ message })
    }
}
