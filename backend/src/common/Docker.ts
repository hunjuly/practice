import { ResponseMessage, utils, HttpRequest, StatusCode } from '.'

export type CreateOpt = {
    Image: string
    name?: string
    Cmd?: string[]
    Env?: string[]
    HostConfig?: {
        AutoRemove?: boolean
        Binds?: string[]
        NetworkMode?: string
    }
}

export type ContainerInfo = {
    Id: string
    Names: string[]
    Image: string
    ImageID: string
    Command: string
    Created: number
    Ports: string[]
    Labels: unknown
    State: string
    Status: string
    HostConfig: unknown
    NetworkSettings: {
        IPAddress: string
        MacAddress: string
    }
    Mounts: unknown[]
}

export class Docker {
    public static async create(option: CreateOpt): Promise<Docker> {
        let command = 'containers/create'

        if (option.name) {
            command += `?name=${option.name}`
        }

        const res = await Docker.post(command, option)

        const result = res.json() as { Id: string }

        return new Docker(result.Id)
    }

    private readonly containerId: string

    private constructor(containerId: string) {
        this.containerId = containerId
    }

    public async start(): Promise<void> {
        await Docker.post(`containers/${this.containerId}/start`)
    }

    public async waitDone(): Promise<void> {
        await Docker.post(`containers/${this.containerId}/wait`)
    }

    public async stop(): Promise<void> {
        await Docker.post(`containers/${this.containerId}/stop`)
    }

    public async info(): Promise<ContainerInfo> {
        const res = await Docker.get(`containers/${this.containerId}/json`)

        return res.json() as ContainerInfo
    }

    public async remove(): Promise<void> {
        await Docker.delete(`containers/${this.containerId}?v=true&force=true`)
    }

    public async logs(): Promise<string> {
        const res = await Docker.get(`containers/${this.containerId}/logs?stderr=true&stdout=true`)

        return res.text()
    }

    public async waitLog(patterns: string[], seconds: number): Promise<string | undefined> {
        for (let i = 0; i < seconds; i++) {
            await utils.sleep(1000)

            const log = await this.logs()

            for (const pattern of patterns) {
                if (log.includes(pattern)) {
                    return pattern
                }
            }
        }

        return undefined
    }

    public async exec(cmd: string[]): Promise<StatusCode> {
        const option = { Cmd: cmd } as unknown
        const command = `containers/${this.containerId}/exec`

        const res = await Docker.post(command, option)
        const container = res.json() as { Id: string }

        const res2 = await Docker.post(`exec/${container.Id}/start`, {
            Detach: false,
            Tty: false
        })

        return res2.status
    }

    private static get(path: string): Promise<ResponseMessage> {
        const opts = {
            socketPath: '/var/run/docker.sock',
            path: `http:/v1.40/${path}`,
            method: 'GET'
        }

        return HttpRequest.sendBuffer(opts)
    }

    private static delete(path: string): Promise<ResponseMessage> {
        const opts = {
            socketPath: '/var/run/docker.sock',
            path: `http:/v1.40/${path}`,
            method: 'DELETE'
        }

        return HttpRequest.sendBuffer(opts)
    }

    private static post(path: string, body?: unknown): Promise<ResponseMessage> {
        const opts = {
            socketPath: '/var/run/docker.sock',
            path: `http:/v1.40/${path}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }

        return HttpRequest.sendBuffer(opts, body)
    }
}
