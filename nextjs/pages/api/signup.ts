import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { post } from './lib/request'

export default withIronSessionApiRoute(signupRoute, sessionOptions)

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        await post('/users', body)

        res.json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
