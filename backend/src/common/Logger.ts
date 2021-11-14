/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export interface Logger {
    info(msg: string | unknown): void
    warning(msg: string | unknown): void
    error(msg: string | unknown): void
}

export class DefaultLogger implements Logger {
    public info(msg: string | unknown): void {
        console.log(msg)
    }

    public warning(msg: string | unknown): void {
        console.log(msg)
    }

    public error(msg: string | unknown): void {
        console.log(msg)
    }
}

declare global {
    const log: Logger
}

const g = global as any

g.log = new DefaultLogger()
