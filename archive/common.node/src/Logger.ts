/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export interface Logger {
    info(...data: any[]): void
    warning(...data: any[]): void
    error(...data: any[]): void
}

export class DefaultLogger implements Logger {
    public info(...data: any[]): void {
        console.log(data)
    }

    public warning(...data: any[]): void {
        console.log(data)
    }

    public error(...data: any[]): void {
        console.log(data)
    }
}

declare global {
    const log: Logger
}

const g = global as any

g.log = new DefaultLogger()
