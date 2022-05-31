import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { get } from './lib/request'

export default withIronSessionApiRoute(users, sessionOptions)

async function users(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = req.session.user

        const { data } = await get('/users', session?.authCookie)

        console.log(JSON.stringify(data))

        const { id, email } = data as { id: string; email: string }

        res.json({})
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
