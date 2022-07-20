import Link from 'next/link'

export default function Copyright() {
    return (
        <div>
            {'Copyright © manncode.com '}
            <Link href={'https://manncode.com/'}>
                <a>manncode.com</a>
            </Link>
            {new Date().getFullYear()}
            {'.'}
        </div>
    )
}
