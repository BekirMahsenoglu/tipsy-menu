const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

process.env.BUILD_STATIC = '1'

const apiPath = path.join(process.cwd(), 'app', 'api')
const backupPath = path.join(process.cwd(), '_api_backup')

if (fs.existsSync(apiPath)) {
  fs.cpSync(apiPath, backupPath, { recursive: true })
  fs.rmSync(apiPath, { recursive: true })
}

try {
  execSync('next build', { stdio: 'inherit' })
} finally {
  if (fs.existsSync(backupPath)) {
    fs.cpSync(backupPath, apiPath, { recursive: true })
    fs.rmSync(backupPath, { recursive: true })
  }
}
