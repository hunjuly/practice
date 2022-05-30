import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

import type { User } from './user'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body
    // const { email, password } = body

    try {
        const {
            data: { login, avatar_url }
        } = { data: { login: 'login#1', avatar_url: 'http://avatar/url' } }

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User

        req.session.user = user

        await req.session.save()

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
