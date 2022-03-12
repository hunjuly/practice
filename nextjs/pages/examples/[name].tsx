export default function Post({
    postData
}: {
    postData: {
        title: string
        id: string
        date: string
    }
}) {
    return (
        <div>
            {postData.title}
            <br />
            {postData.id}
            <br />
            {postData.date}
        </div>
    )
}

function getAllPostIds() {
    const fileNames = ['ssg-ssr.md', 'pre-rendering.md']

    return fileNames.map((fileName) => {
        return {
            params: {
                name: fileName.replace(/\.md$/, '')
            }
        }
    })
}

// export async function getStaticPaths() {
//     const paths = getAllPostIds()

//     return {
//         paths,
//         fallback: false
//     }
// }

// export async function getStaticProps({ params }: { params: { name: string } }) {
//     const postData = { title: 'title', id: params.name, date: 'date' }

//     return {
//         props: {
//             postData
//         }
//     }
// }

export async function getServerSideProps({ params }: { params: { name: string } }) {
    const postData = { title: 'title', id: params.name, date: 'date' }

    return {
        props: {
            postData
        }
    }
}
