import React from 'react'

type Command = {
    name: string
    value?: unknown
}

type CommandHandler = {
    name: string
    id: string
    handler: any
}

class CommandListerner {
    private commands: Command[]
    private handlers: CommandHandler[]

    constructor() {
        this.commands = []
        this.handlers = []
    }

    public setHandler(name: string, id: string, handler: any) {
        this.handlers.push({ name, id, handler })
    }

    // 저장 후 종료와 같이 command가 여러개의 혹은 단일의 다른 command로 변경되는 경우가 있다.
    // CommandGroup이나 CommandChildren을 정의해서 실행하게 하자.
    public pushCommand(commands: Command[] | Command) {
        if (Array.isArray(commands)) {
            this.commands.push(...commands)
        } else {
            this.commands.push(commands)
            for (const handler of this.handlers) {
                if (handler.name === commands.name) {
                    handler.handler(commands.value)
                }
            }
        }
    }
}

export function useCommandContext() {
    const context = React.useMemo((): CommandListerner => {
        return new CommandListerner()
    }, [])

    return context
}
