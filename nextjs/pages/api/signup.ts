import { withIronSessionApiRoute } from 'iron-session/next'
import fetchJson from 'lib/fetchJson'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

import type { User } from './user'

export default withIronSessionApiRoute(signupRoute, sessionOptions)

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body

    const { email, password } = body

    try {
        const data = await fetchJson('http://localhost:4000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        // const {
        //     data: { login, avatar_url }
        // } = data
        const login = 'lgoin'
        const avatar_url = 'url'

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User

        req.session.user = user

        await req.session.save()

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
