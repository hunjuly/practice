import { NextApiRequest, NextApiResponse } from 'next'

const host = 'http://localhost:4000'

export default async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookie = req.headers['cookie']
        const headers = cookie ? { cookie } : undefined

        const option = { method: 'DELETE', headers }

        const url = host + '/auth'

        const response = await fetch(url, option)

        if (response.ok) {
            const cookie = response.headers.get('set-cookie')

            if (cookie) {
                res.setHeader('set-cookie', cookie).json({ message: 'success' })
            }
        } else {
            const data = await response.json()

            res.status(response.status).json({ message: response.statusText })
        }
    } catch (error) {
        const message = (error as Error).message

        res.status(500).json({ message })
    }
}
