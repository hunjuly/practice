import { useCommandContext } from './command'

test('CommandContext', () => {
    const cmdCtx = useCommandContext()

    const handler = (value: string) => {
        console.log(value)
    }

    cmdCtx.setHandler('ShowTestView', 'testid', handler)

    cmdCtx.pushCommand({ name: 'ShowTestView', value: 'testValue' })
})
