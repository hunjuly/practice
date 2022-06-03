import { withSessionApiRoute } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { serviceApi } from 'lib/request'

export default withSessionApiRoute(route)

type LoginInfo = {
    id: string
    email: string
}

async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const { data, headers } = await serviceApi.post<LoginInfo>('/auth/login', body)

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
