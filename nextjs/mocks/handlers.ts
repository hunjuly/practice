import { rest } from 'msw'

export const handlers = [
    rest.get('/api/login', (req, res, ctx) => {
        console.log('--------------------------------------')

        return res(
            ctx.json({
                title: 'Lord of the Rings',
                imageUrl: '/book-cover.jpg',
                description: 'The Lord of the Rings is an epic high-fantasy'
            })
        )
    }),
    rest.get('http://localhost:4000/users', (req, res, ctx) => {
        console.log('-----------------------OKOK  CALL ------------')

        return res(
            ctx.json({
                title: 'Lord of the Rings',
                imageUrl: '/book-cover.jpg',
                description: 'The Lord of the Rings is an epic high-fantasy'
            })
        )
    }),
    rest.get('/api/register', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: '60333292-7ca1-4361-bf38-b6b43b90cb16',
                    author: 'John Maverick',
                    text: 'Lord of The Rings, is with no absolute hesitation'
                }
            ])
        )
    })
]

/*
export const handlers = [
    rest.post('/users', (req, res, ctx) => {
        // Persist user's authentication in the session
        // sessionStorage.setItem('is-authenticated', 'true')

        return res(
            // Respond with a 200 status code
            ctx.json({})
        )
    }),

    rest.post('/login', (req, res, ctx) => {
        // Persist user's authentication in the session
        sessionStorage.setItem('is-authenticated', 'true')

        return res(
            // Respond with a 200 status code
            ctx.status(200)
        )
    }),

    rest.get('/user', (req, res, ctx) => {
        // Check if the user is authenticated in this session
        const isAuthenticated = sessionStorage.getItem('is-authenticated')

        if (!isAuthenticated) {
            // If not authenticated, respond with a 403 error
            return res(
                ctx.status(403),
                ctx.json({
                    errorMessage: 'Not authorized'
                })
            )
        }

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.json({
                username: 'admin'
            })
        )
    })
]
*/
