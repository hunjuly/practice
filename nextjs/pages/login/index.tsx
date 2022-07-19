import * as React from 'react'
import type { ReactElement } from 'react'
import { useUser } from 'hooks/useUser'
import { RequestError } from 'types'
import Link from 'next/link'

export default function Login() {
    const user = useUser({ redirectTo: { ifLoggedIn: '/dashboard' } })

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
        try {
            await user.login(email, password)
        } catch (error) {
            if (error instanceof RequestError) {
                setErrorMsg(error.message)
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
                <Link href="/register">
                    <a>Don't have an account? Sign Up</a>
                </Link>
            </div>
            <div className="Comment">React의 useState를 사용해서 사용자의 입력을 처리함</div>
        </div>
    )
}

Login.getLayout = function getLayout(page: ReactElement) {
    return page
}
