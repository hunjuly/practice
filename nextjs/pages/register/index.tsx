import * as React from 'react'
import type { ReactElement } from 'react'
import { useUser } from 'hooks/useUser'
import { RequestError } from 'types'
import Link from 'next/link'

export default function Register() {
    const user = useUser({ redirectTo: { ifLoggedIn: '/dashboard' } })

    const [errorMsg, setErrorMsg] = React.useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const data = new FormData(event.currentTarget)

            const body = {
                firstName: data.get('firstName') as string,
                lastName: data.get('lastName') as string,
                email: data.get('email') as string,
                password: data.get('password') as string
            }

            await user.register(body)

            await user.login(body.email, body.password)
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first">First name</label>
                    <input type="text" id="first" name="firstName" value="first" required />
                </div>
                <div>
                    <label htmlFor="last">Last name</label>
                    <input type="text" id="last" name="lastName" value="last" required />
                </div>
                <div>
                    <label htmlFor="email">email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value="test@mail.com"
                        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <input type="password" id="password" name="password" value="\" required />
                </div>
                <div hidden={errorMsg === undefined}>Error: {errorMsg}</div>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <Link href="/login">
                    <a>Already have an account?</a>
                </Link>
            </div>
            <div className="Comment">FormData을 사용해서 사용자의 입력을 처리함</div>
        </div>
    )
}

Register.getLayout = function getLayout(page: ReactElement) {
    return page
}
