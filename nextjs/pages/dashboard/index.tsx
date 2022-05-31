import * as React from 'react'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import useUser from 'lib/useUser'
import { delete_ } from 'lib/request'
import { Box } from '@mui/material'
import { FetchError } from 'lib/types'

/*
0. SSR 구현
1. Dashboard에 users 표시
2. Layout 구현
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
