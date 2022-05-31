import { withIronSessionApiRoute } from 'iron-session/next'
import fetchJson from 'lib/fetchJson'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(signupRoute, sessionOptions)

const backendUrl = process.env.BACKEND_URL as string

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const responseBody = await fetchJson(backendUrl + '/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        // res.json(responseBody.data)

        res.json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
