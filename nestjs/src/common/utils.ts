import { randomBytes } from 'crypto'
import { File } from './File'

export class utils {
    public static uuid(): string {
        return randomBytes(16).toString('hex')
    }

    public static async sleep(timeout: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, timeout))
    }

    public static createChunk(size: number): string {
        const chunk = Buffer.alloc(size, 'abcdefghijklmnopqrstuvwxyz1234567890')

        return chunk.toString()
    }
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
