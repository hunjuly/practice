import * as React from 'react'
import { GetServerSideProps } from 'next'
import { PaginatedResponse, User } from 'types'
import { withSessionSsr } from 'common/session'

type GetType = PaginatedResponse<User>
type PropsType = { paginatedUsers: PaginatedResponse<User> }

export const getServerSideProps: GetServerSideProps = withSessionSsr<PropsType>(async ({ get }) => {
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
