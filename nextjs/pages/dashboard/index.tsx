import * as React from 'react'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import useUser from 'lib/useUser'
import { delete_ } from 'lib/request'
import { FetchError } from 'lib/types'

/*
api는 클라이언트에서 submit 할 때만 필요.

request 하나로 통합

0. SSR 구현
3. BackendMock 구현
*/

export default function Dashboard({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { user, mutateUser } = useUser({ redirectTo: '/signin' })
    const [errorMsg, setErrorMsg] = React.useState('')

    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(data)}</div>
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    try {
                        mutateUser(await delete_('/api/logout'), false)
                    } catch (error: unknown) {
                        console.error('An unexpected error happened:', error)
                        if (error instanceof FetchError) {
                            setErrorMsg(error.data.message)
                        } else {
                            console.error('An unexpected error happened:', error)
                        }
                    }
                }}
            >
                Logout
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    // const user = req.session.user

    // const res = await fetch('https://.../data')
    // const data: Data = await res.json()

    const data = {
        users: [
            {
                isLoggedIn: false,
                id: 'string',
                email: 'string',
                authCookie: 'string'
            }
        ]
    }

    if (!data) {
        // 아래 redirect로 충분한가? res.setHeader 해야 하는가?
        //         res.setHeader('location', '/login')
        //         res.statusCode = 302
        //         res.end()
        return {
            redirect: { destination: '/', permanent: false }
        }
    }

    return {
        props: {
            data
        }
    }
}, sessionOptions)
