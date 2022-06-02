import * as React from 'react'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { withSessionSsr } from 'lib/session'
import { FetchError, delete_ } from 'lib/request'
import { useUserSession, UserSession } from 'hooks/useUserSession'

/*
api는 클라이언트에서 submit 할 때만 필요. 혹은, session에 접근할 때

3. BackendMock 구현
*/

export default function Dashboard({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { user, mutateUser } = useUserSession({ redirectTo: '/signin' })
    const [errorMsg, setErrorMsg] = React.useState('')

    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(data)}</div>
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    try {
                        const { data } = await delete_('/api/logout')

                        mutateUser(data as UserSession, false)
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

// req,res 외에 추가 인자 등 상세 설명
// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = withSessionSsr(async ({ req, res }) => {
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
        return {
            redirect: { destination: '/', permanent: false }
        }
    }

    return {
        props: {
            data
        }
    }
})
