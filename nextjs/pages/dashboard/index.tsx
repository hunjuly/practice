import * as React from 'react'
import { GetServerSideProps } from 'next'
import { serverSide, clientSide } from 'lib/request'
import { useUserSession, UserSession } from 'hooks/useUserSession'
import { User, PaginatedResponse } from 'lib/types'
import { withSessionSsr } from 'lib/session'

type GetType = PaginatedResponse<User>
type PropsType = { paginatedUsers: PaginatedResponse<User> }

// req,res 외에 추가 인자 등 상세 설명
// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = withSessionSsr<PropsType>(async ({ req, res }) => {
    const option = { authCookie: req.session.user?.authCookie }

    const paginatedUsers = await serverSide.get<GetType>('/users', option)

    if (!paginatedUsers) {
        return {
            redirect: { destination: '/', permanent: false }
        }
    }

    return {
        props: { paginatedUsers }
    }
})

export default function Dashboard({ paginatedUsers }: PropsType) {
    const { mutateUser } = useUserSession({ redirectTo: '/signin' })

    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(paginatedUsers.items)}</div>
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    try {
                        const data = await clientSide.delete_<UserSession>('/api/logout')

                        mutateUser(data, false)
                    } catch (error) {
                        console.error('An unexpected error happened:', error)
                    }
                }}
            >
                Logout
            </div>
        </div>
    )
}
