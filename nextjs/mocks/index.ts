export async function initMocks() {
    if (typeof window === 'undefined') {
        console.log('----------------- SERVER -------------------')
        const { server } = await import('./server')

        server.listen()

        console.log('REQUEST001')
        fetch('http://localhost:4000/users')
    } else {
        console.log('----------------- CLIENT -------------------')
        const { worker } = await import('./browser')

        worker.start()
    }
}

initMocks()
