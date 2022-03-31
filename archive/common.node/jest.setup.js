import * as fs from 'fs'

process.env['SERVICE_PORT'] = '4000'

if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true })
}
