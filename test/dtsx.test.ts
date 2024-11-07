import { afterAll, beforeAll, describe } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'

const tempDir = path.resolve(process.cwd(), 'test-temp')
const srcDir = path.join(tempDir, 'src')
const outDir = path.join(tempDir, 'dist')

describe('bun-plugin-dtsx', () => {
  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true })
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(outDir, { recursive: true })

    const sampleFile = path.join(srcDir, 'sample.ts')
    fs.writeFileSync(
      sampleFile,
      `
      export interface User {
        id: number;
        name: string;
      }

      export function greet(user: User): string {
        return \`Hello, \${user.name}!\`;
      }
    `,
    )
  })

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })
})
