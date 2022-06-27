import { randomBytes } from 'crypto'
import { File } from './File'

export class utils {
    public static uuid(): string {
        return randomBytes(16).toString('hex')
    }

    public static env(key: string): string | undefined {
        return process.env[key]
    }

    public static envs(keys: string[]): Map<string, string> | undefined {
        const map = new Map<string, string>()

        for (const key of keys) {
            const value = process.env[key]

            if (value === undefined) {
                return undefined
            } else {
                map.set(key, value)
            }
        }

        return map
    }

    public static async sleep(timeout: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, timeout))
    }

    public static createChunk(size: number): string {
        const chunk = Buffer.alloc(size, 'abcdefghijklmnopqrstuvwxyz1234567890')

        return chunk.toString()
    }
}

export function entityToDto<S, O>(items: S[], create: (s: S) => O) {
    const dtos: O[] = []

    items.map((item) => {
        const dto = create(item)

        dtos.push(dto)
    })

    return dtos
}

type PackageInfo = {
    name: string
    version: string
    description: string
}

export function getPackageInfo() {
    const info = File.readJson<PackageInfo>('package.json')

    return info
}
