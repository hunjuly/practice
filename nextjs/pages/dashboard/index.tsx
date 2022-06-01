import * as React from 'react'
import useUser from 'lib/useUser'
import { delete_ } from 'lib/request'
import { FetchError } from 'lib/types'

/*
api는 클라이언트에서 submit 할 때만 필요.
ssr은 데이터 다 구해서 전달
ssr의 세션은?

0. SSR 구현
1. Dashboard에 users 표시
2. Layout 구현
3. BackendMock 구현

1. mui는 data를 기존 mui에 맞춘다. MuiList에 MuiItem이 있다면 거기에 맞춰서 ssr 단계에서 채워넣는다.
*/
export default function Dashboard() {
    const { user, mutateUser } = useUser({ redirectTo: '/signin' })
    const [errorMsg, setErrorMsg] = React.useState('')

    return (
        <div>
            Dashboard GUI
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
