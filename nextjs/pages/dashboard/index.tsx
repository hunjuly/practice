import * as React from 'react'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import { useRouter } from 'next/router'

export default function Dashboard() {
    const { user, mutateUser } = useUser({
        redirectTo: '/signin'
    })
    const router = useRouter()

    console.log(JSON.stringify(user))

    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="https://mui.com/">
                Your Website
            </MuiLink>{' '}
            {new Date().getFullYear()}.
            <div
                onClick={async (e) => {
                    e.preventDefault()

                    mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false)

                    router.push('/signin')
                }}
            >
                Logout
            </div>
        </Typography>
    )
}
