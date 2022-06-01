import * as React from 'react'
import type { ReactElement } from 'react'
import useUser from 'lib/useUser'
import { post } from 'lib/request'
import { FetchError } from 'lib/types'
import Link from 'next/link'

export default function SignIn() {
    const { mutateUser } = useUser({ redirectTo: '/dashboard', redirectIfFound: true })

    const [errorMsg, setErrorMsg] = React.useState<string>()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value)
    }

    const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value)
    }

    const handleSubmit = async (_event: React.MouseEvent<HTMLInputElement>) => {
        const body = { email, password }

        try {
            mutateUser(await post('/api/login', body))
        } catch (error: unknown) {
            if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
            } else {
                console.error('An unexpected error happened:', error)
            }
        }
    }

    return (
        <div>
            <div>
                Email:
                <input type="text" value={email} onChange={handleEmailChange} />
            </div>
            <div>
                Password:
                <input type="text" value={password} onChange={handlePasswordChange} />
            </div>
            <div hidden={errorMsg === undefined}>Error: {errorMsg}</div>
            <input type="button" value={'Submit'} onClick={handleSubmit} />
            <div>
                <Link href="/signup">
                    <a>Don't have an account? Sign Up</a>
                </Link>
            </div>
            <div className="Comment">React의 usetState를 사용해서 사용자의 입력을 처리함</div>
        </div>
    )
}

SignIn.getLayout = function getLayout(page: ReactElement) {
    return page
}
