import * as fs from 'fs'

process.env['SERVICE_PORT'] = '4000'

if (fs.existsSync('output')) {
    fs.rmSync('output', { recursive: true })
}
