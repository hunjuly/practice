/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export interface Logger {
    info(msg: string | any): void
    warning(msg: string | any): void
    error(msg: string | any): void
}

export class DefaultLogger implements Logger {
    public info(msg: string | any): void {
        if (typeof msg === 'string') console.log(msg)
        else console.log(JSON.stringify(msg))
    }

    public warning(msg: string | any): void {
        if (typeof msg === 'string') console.log(msg)
        else console.log(JSON.stringify(msg))
    }

    public error(msg: string | any): void {
        if (typeof msg === 'string') console.log(msg)
        else console.log(JSON.stringify(msg))
    }
}

declare global {
    const log: Logger
}

const g = global as any

g.log = new DefaultLogger()
