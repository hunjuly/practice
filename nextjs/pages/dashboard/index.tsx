import * as React from 'react'
import { GetServerSideProps } from 'next'
import { PaginatedResponse, User, zeroItems } from 'types'

type GetType = PaginatedResponse<User>
type PropsType = { paginatedUsers: PaginatedResponse<User> }

// req,res 외에 추가 인자 등 상세 설명
// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers.cookie ? { cookie: context.req.headers.cookie } : undefined

    const option = {
        method: 'GET',
        headers
    }

    const host = 'http://localhost:4000'
    const url = host + '/users'

    const response = await fetch(url, option)

    const data = await response.json()

    const paginatedUsers = data as GetType

    if (paginatedUsers) {
        return {
            props: { paginatedUsers }
        }
    }

    return { props: { paginatedUsers: zeroItems as PaginatedResponse<User> } }
}
// export const getServerSideProps: GetServerSideProps = withSessionSsr<PropsType>(async ({ get, req }) => {
//     const user = req.session.user

//     if (user) {
//         const paginatedUsers = await get<GetType>('/users')

//         if (paginatedUsers) {
//             return {
//                 props: { paginatedUsers }
//             }
//         }
//     }

//     return {
//         redirect: { destination: '/', permanent: false }
//     }
// })

export default function Dashboard({ paginatedUsers }: PropsType) {
    return (
        <div>
            Dashboard GUI
            <div>{JSON.stringify(paginatedUsers.items)}</div>
        </div>
    )
}
