import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionApiRoute } from 'lib/session'
import { User, PaginatedResponse } from './types'
import * as remote from './remote'

export default withSessionApiRoute(route)

type GetType = PaginatedResponse<User>

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data } = await remote.get<GetType>('/users', req.session.user?.authCookie)

        res.json(data)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
