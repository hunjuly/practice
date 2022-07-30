import { getServerSideWithCookie } from 'common/session'
import * as React from 'react'
import { PaginatedResponse, User } from 'types'

type GetType = PaginatedResponse<User>
type PropsType = { paginatedUsers: PaginatedResponse<User> }

export const getServerSideProps = getServerSideWithCookie<PropsType>(async ({ get }) => {
    const data = await get('/users')

    const paginatedUsers = data as GetType

    if (paginatedUsers) {
        return {
            props: { paginatedUsers }
        }
    }

    return {
        redirect: { destination: '/', permanent: false }
    }
})

export default function Dashboard({ paginatedUsers }: PropsType) {
    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(paginatedUsers.items)}</div>
        </div>
    )
}
