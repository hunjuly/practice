import * as React from 'react'
import { GetServerSideProps } from 'next'
import { withSessionSsr } from 'lib/session'
import { localApi, serviceApi } from 'lib/request'
import { useUserSession, UserSession } from 'hooks/useUserSession'

type User = {
    id: string
    email: string
    isActive: boolean
    role: string
}

type PaginatedResponse<T> = {
    total: number
    limit: number
    offset: number
    items: T[]
}

type PropsType = { paginatedUsers: PaginatedResponse<User> }

export default function Dashboard({ paginatedUsers }: PropsType) {
    const { user, mutateUser } = useUserSession({ redirectTo: '/signin' })

    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(paginatedUsers.items)}</div>
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    try {
                        const { data } = await localApi.delete_<UserSession>('/api/logout')

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

// req,res 외에 추가 인자 등 상세 설명
// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = withSessionSsr<PropsType>(async ({ req, res }) => {
    const { data: paginatedUsers } = await serviceApi.get<PaginatedResponse<User>>(
        '/users',
        req.session.user?.authCookie
    )

    if (!paginatedUsers) {
        return {
            redirect: { destination: '/', permanent: false }
        }
    }

    return {
        props: { paginatedUsers }
    }
})
