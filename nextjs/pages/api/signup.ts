import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import * as remote from './remote'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        await remote.post('/users', body)

        res.json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
