import fs from 'fs'
import path from 'path'

const targetFile = path.join(process.cwd(), 'build/index.js')

const originalContent = fs.readFileSync(targetFile, 'utf8')
fs.writeFileSync(
  targetFile,
  originalContent
    .replace('const server = new Server(manifest);', 'const server = new Server(manifest);\nawait server.init({ env: (Bun||process).env })')
)
