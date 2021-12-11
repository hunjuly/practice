import React from 'react'
import './App.css'
import { View1 } from './View1'
import { useCommandContext } from './common/command'

function App() {
    const cmdCtx = useCommandContext()

    const handler = (value: string) => {
        alert(value)
    }

    cmdCtx.setHandler('ShowTestView', 'testid', handler)

    const invoke = () => cmdCtx.pushCommand({ name: 'ShowTestView', value: 'testValue' })

    const [value, setValue] = React.useState('')

    return (
        <div className="App">
            <div onClick={invoke}>Invoke Command</div>
            <View1 value={value} />
            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
        </div>
    )
}

export default App
