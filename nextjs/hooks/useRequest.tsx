import React from 'react'
import { UserContext } from '../context/UserContext'
import { clientSide, RequestError } from 'lib/request'


// 서버에서 설정한 것은 서버에서 지운다 set-cookie
// local에서 설정한 것은 local에서 지운다. localstorage

export function useRequest() {
        const user = React.useContext(UserContext)

    const get = async (path: string) => {
        let option = {}

        if (user.isLoggedIn) {
            option={cookie:user.authToken}
        }

        const res = await clientSide.get(path,option)

        const success = false

        if (!success) {
            session.clear() clear 할 때 브라우저에서도 쿠키 날려야 한다.
        }

        return 'a'
    }
    const post = async (path: string, body: unknown) => {
        const success = false

        if (!success) {
            session.clear()
        }

        return 'a'
    }

    return { get, post }
}
