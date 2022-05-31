import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { post } from './lib/request'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const { data, headers } = await post('/auth/login', body)

        const { id, email } = data as { id: string; email: string }

        const authCookie = headers.get('set-cookie')

        if (authCookie) {
            req.session.user = { isLoggedIn: true, id, email, authCookie }

            await req.session.save()

            res.json({})
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
