import React from 'react'
import { render, screen } from '@testing-library/react'
import { useCommandContext } from './command'

test('renders learn react link', () => {
    render(<App />)
})

test('CommandContext', () => {
    const cmdCtx = useCommandContext()

    const handler = (value: string) => {
        console.log(value)
    }

    cmdCtx.setHandler('ShowTestView', 'testid', handler)

    cmdCtx.pushCommand({ name: 'ShowTestView', value: 'testValue' })
})
