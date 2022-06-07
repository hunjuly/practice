import { withSessionApiRoute } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { LoginInfo } from './types'
import * as remote from './remote'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const { data, headers } = await remote.post<LoginInfo>('/auth/login', body)

        const { id, email } = data

        const authCookie = headers.get('set-cookie')

        if (authCookie) {
            req.session.user = { isLoggedIn: true, id, email, authCookie }

            await req.session.save()

            res.json({})
        }
    } catch (error) {
        const message = (error as Error).message

        res.status(500).json({ message })
    }
}
