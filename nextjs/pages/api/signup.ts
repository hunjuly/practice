import { withIronSessionApiRoute } from 'iron-session/next'
import fetchJson from 'lib/fetchJson'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

import type { User } from './user'

export default withIronSessionApiRoute(signupRoute, sessionOptions)

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body

    // const { email, password } = body

    try {
        const data2 = await fetchJson('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        const { id, email } = data2 as { id: string; email: string }

        console.log('id, email ------ ', id, email)

        const data = await fetchJson('http://localhost:4000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        console.log('data ------ ', data)

        const login = id
        const avatar_url = email

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User

        req.session.user = user

        await req.session.save()

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

// < Set-Cookie: connect.sid=s%3AQu2pnp84rzMhMik5w1w8ijslwStFT1Ow0; Path=/; HttpOnly
// const cookies = res.headers['set-cookie'][0].split(';')
// curl http://localhost:4000/users --cookie "connect.sid=s%3AW263OQ3h8lMvJrqGc;"
