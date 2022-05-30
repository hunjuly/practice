import { withIronSessionApiRoute } from 'iron-session/next'
import fetchJson from 'lib/fetchJson'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

import type { User } from './user'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

const backendUrl = process.env.BACKEND_URL as string

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const { data, headers } = await fetchJson(backendUrl + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        const { id, email } = data as { id: string; email: string }

        console.log('-------- JSON.stringify(data)', JSON.stringify(data))

        const cookie = headers['set-cookie']

        const user = { isLoggedIn: true, id, email, cookie } as User

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
