import * as React from 'react'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import useUser from 'lib/useUser'
import { delete_ } from 'lib/request'
import { Box } from '@mui/material'
import { FetchError } from 'lib/types'

/*
api는 클라이언트에서,정적 렌더링만
ssr은 데이터 다 구해서 전달
ssr의 세션은?

1. mui 제거, 기본 css로 구현, nextjs만 사용, nextjs 샘플만 사용한다.
0. SSR 구현
1. Dashboard에 users 표시
2. Layout 구현

1. mui는 data를 기존 mui에 맞춘다. MuiList에 MuiItem이 있다면 거기에 맞춰서 ssr 단계에서 채워넣는다.

공연 목록
제목, 시간, 티켓, 예매
*/
export default function Dashboard() {
    const { user, mutateUser } = useUser({ redirectTo: '/signin' })
    const [errorMsg, setErrorMsg] = React.useState('')

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                <MuiLink color="inherit" href="https://mui.com/">
                    Dashboard GUI
                </MuiLink>{' '}
                {new Date().getFullYear()}.
            </Typography>
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
        </Box>
    )
}
