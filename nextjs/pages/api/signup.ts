import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { serviceApi } from 'lib/request'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        await serviceApi.post('/users', body)

        res.json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
