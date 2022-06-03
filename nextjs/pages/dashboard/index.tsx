import * as React from 'react'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { withSessionSsr } from 'lib/session'
import { RequestError, localApi } from 'lib/request'
import { useUserSession, UserSession } from 'hooks/useUserSession'

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
                        const { data } = await localApi.delete_<UserSession>('/api/logout')

                        mutateUser(data, false)
                    } catch (error) {
                        if (error instanceof RequestError) {
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
        users: [{ isLoggedIn: false, id: 'string', email: 'string', authCookie: 'string' }]
    }

    if (!data) {
        return {
            redirect: { destination: '/', permanent: false }
        }
    }

    return {
        props: { data }
    }
})
