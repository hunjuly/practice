import { Shell } from '.'
import { Docker } from './Docker'

test(
    'Docker',
    async () => {
        const testimage = 'hello-world:latest'

        await Shell.exec(`docker pull ${testimage}`)

        const option = { Image: testimage }

        const container = await Docker.create(option)

        await container.start()
        await container.waitDone()

        const text = await container.logs()
        console.log(text)

        await container.stop()
        await container.remove()
    },
    30 * 1000
)
