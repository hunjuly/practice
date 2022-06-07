import { withSessionApiRoute } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { LoginInfo } from 'lib/types'
import { serverSide } from 'lib/request'

export default withSessionApiRoute(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const authHeader = req.session.user?.authCookie ? { cookie: req.session.user.authCookie } : undefined

        const option = {
            method: 'POST',
            headers: { ...authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        const { data, headers } = await serverSide.request<LoginInfo>('/auth/login', option)

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
