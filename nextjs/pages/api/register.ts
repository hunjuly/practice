import { NextApiRequest, NextApiResponse } from 'next'

const host = 'http://localhost:4000'

export default async function route(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = await req.body

        const option = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        const url = host + '/users'

        const response = await fetch(url, option)

        const data = await response.json()

        if (response.ok) {
            res.json(data)
        } else {
            res.status(response.status).json({ message: response.statusText })
        }
    } catch (error) {
        const message = (error as Error).message

        res.status(500).json({ message })
    }
}
