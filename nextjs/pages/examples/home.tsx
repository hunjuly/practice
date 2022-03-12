import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Layout from '../components/layout'

// export async function getStaticProps() {
//     return {
//         props: {
//             allPostsData2: ['a', 'b', 'c']
//         }
//     }
// }

export async function getServerSideProps() {
    return {
        props: {
            allPostsData: [6, 7, 8, 9]
        }
    }
}

function Header({ title }: { title: string }) {
    return <h1>{title ? title : 'Default title'}</h1>
}

export default function HomePage({ allPostsData }: { allPostsData: string[]; serverProps: number[] }) {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']
    const [likes, setLikes] = useState(0)

    function handleClick() {
        setLikes(likes + 1)
    }

    return (
        <Layout>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Header title={`${allPostsData} 1- 6Develop. Preview. Ship. 🚀`} />
                <h1 className="title">
                    Read{' '}
                    <Link href="/">
                        <a>this page!</a>
                    </Link>
                </h1>
                <Image
                    src="/images/profile.webp" // Route of the image file
                    height={144} // Desired size with correct aspect ratio
                    width={144} // Desired size with correct aspect ratio
                    alt="Your Name"
                />
                <ul>
                    {names.map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>

                <button onClick={handleClick}>Like ({likes})</button>
            </div>
        </Layout>
    )
}
