import useUser from 'lib/useUser'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, mutateUser } = useUser()
    const router = useRouter()

    return (
        <>
            <main>
                <div className="container">{children}</div>
            </main>
        </>
    )
}
