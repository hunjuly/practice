import React from 'react'
import './App.css'

type Props = {
    value: string
}

export function View1({ value }: Props) {
    return <div className="View1">View1 {value}</div>
}
