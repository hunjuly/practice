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
export const getServerSideProps: GetServerSideProps = withSessionSsr<PropsType>(async (request) => {
    const paginatedUsers = await request.get<GetType>('/users')

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
    const { mutateUser } = useUserSession({ redirectTo: '/login' })

    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(paginatedUsers.items)}</div>
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    const data = await clientSide.delete_<UserSession>('/api/logout')

                    mutateUser(data, false)
                }}
            >
                Logout
            </div>
        </div>
    )
}
