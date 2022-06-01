import * as React from 'react'
import type { ReactElement } from 'react'
import useUser from 'lib/useUser'
import { post } from 'lib/request'
import { FetchError } from 'lib/types'
import Link from 'next/link'

export default function SignUp() {
    const { mutateUser } = useUser({ redirectTo: '/dashboard', redirectIfFound: true })

    const [errorMsg, setErrorMsg] = React.useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const body = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password')
        }

        try {
            await post('/api/signup', body)

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
            <form onSubmit={handleSubmit}>
                <div>
                    First Name:
                    <input type="text" name="firstName" />
                </div>
                <div>
                    Last Name:
                    <input type="text" name="lastName" />
                </div>
                <div>
                    Email:
                    <input type="text" name="email" />
                </div>
                <div>
                    Password:
                    <input type="text" name="password" />
                </div>
                <div hidden={errorMsg === undefined}>Error: {errorMsg}</div>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <Link href="/signin">
                    <a>Already have an account?</a>
                </Link>
            </div>
            <div className="Comment">FormData을 사용해서 사용자의 입력을 처리함</div>
        </div>
    )
}

SignUp.getLayout = function getLayout(page: ReactElement) {
    return page
}
