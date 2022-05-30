import * as React from 'react'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import { useRouter } from 'next/router'
import { Box, Container } from '@mui/material'

export default function Dashboard() {
    const { user, mutateUser } = useUser({ redirectTo: '/signin' })

    const router = useRouter()

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

                    mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false)

                    router.push('/signin')
                }}
            >
                Logout
            </div>
        </Box>
    )
}
