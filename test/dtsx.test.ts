import type { BunPlugin, PluginBuilder } from 'bun'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'
import { dts } from '../src'

const tempDir = path.resolve(process.cwd(), 'test-temp')
const srcDir = path.join(tempDir, 'src')
const outDir = path.join(tempDir, 'dist')

// Mock build config that satisfies Bun's PluginBuilder interface
const mockPluginBuilder: PluginBuilder = {
  config: {
    entrypoints: ['src/sample.ts'],
    root: tempDir,
    outdir: outDir,
    plugins: [] as BunPlugin[],
  },
  // Required plugin builder methods
  onLoad(..._args: any[]) { return mockPluginBuilder },
  onResolve(..._args: any[]) { return mockPluginBuilder },
  onStart(..._args: any[]) { return mockPluginBuilder },
  onBeforeParse(..._args: any[]) { return mockPluginBuilder },
  onEnd(..._args: any[]) { return mockPluginBuilder },
  module: (_specifier: string, callback: () => any) => callback(),
}

describe('bun-plugin-dtsx', () => {
  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true })
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(outDir, { recursive: true })

    // Create a sample TypeScript file
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

    // Create a file with generic types
    const genericFile = path.join(srcDir, 'generic.ts')
    fs.writeFileSync(
      genericFile,
      `
      export interface Container<T> {
        value: T;
      }

      export class Stack<T> {
        private items: T[] = [];

        push(item: T): void {
          this.items.push(item);
        }

        pop(): T | undefined {
          return this.items.pop();
        }
      }
    `,
    )
  })

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  test('should generate declaration files with default options', async () => {
    const plugin = dts({
      root: tempDir,
      outdir: outDir,
      entrypoints: ['src/sample.ts'],
    })

    await plugin.setup(mockPluginBuilder)

    const dtsPath = path.join(outDir, 'src', 'sample.d.ts')
    expect(fs.existsSync(dtsPath)).toBe(true)

    const content = fs.readFileSync(dtsPath, 'utf-8')
    expect(content).toContain('interface User')
    expect(content).toContain('function greet')
  })

  test('should handle generic types correctly', async () => {
    const plugin = dts({
      root: tempDir,
      outdir: outDir,
      entrypoints: ['src/generic.ts'],
    })

    await plugin.setup(mockPluginBuilder)

    const dtsPath = path.join(outDir, 'src', 'generic.d.ts')
    expect(fs.existsSync(dtsPath)).toBe(true)

    const content = fs.readFileSync(dtsPath, 'utf-8')
    expect(content).toContain('interface Container<T>')
    expect(content).toContain('class Stack<T>')
  })

  test('should throw error when root is not provided', async () => {
    const plugin = dts({
      outdir: outDir,
      entrypoints: ['src/sample.ts'],
    })

    const builderWithoutRoot = {
      ...mockPluginBuilder,
      config: { ...mockPluginBuilder.config, root: undefined },
    }

    await expect(plugin.setup(builderWithoutRoot))
      .rejects
      .toThrow('[bun-plugin-dtsx] Root directory is required')
  })

  test('should accept clean option', async () => {
    const plugin = dts({
      root: tempDir,
      outdir: outDir,
      entrypoints: ['src/sample.ts'],
      clean: true,
    })

    await plugin.setup(mockPluginBuilder)

    // Verify declaration file was generated with clean option enabled
    expect(fs.existsSync(path.join(outDir, 'src', 'sample.d.ts'))).toBe(true)
  })
})
