import type { DtsGenerationOption } from '@stacksjs/dtsx'
import type { BunPlugin, PluginBuilder } from 'bun'
import { mkdir } from 'node:fs/promises'
import { dirname, join, posix } from 'node:path'
import process from 'node:process'
import { generate } from '@stacksjs/dtsx'

/**
 * Configuration interface extending DtsGenerationOption.
 */
interface PluginConfig extends DtsGenerationOption {}

interface ZigModule {
  ZIG_AVAILABLE: boolean
  processBatch: (sources: string[], keepComments?: boolean, threadCount?: number) => string[]
}

// Cache the lazy import — `@stacksjs/zig-dtsx` is an optional peer dep.
// Possible cache values: `undefined` (not loaded), `null` (load failed / unavailable), or the module.
let zigCache: ZigModule | null | undefined

async function loadZig(): Promise<ZigModule | null> {
  if (zigCache !== undefined)
    return zigCache
  if (process.env.BUN_PLUGIN_DTSX_NO_ZIG === '1') {
    zigCache = null
    return null
  }
  try {
    const mod = (await import('@stacksjs/zig-dtsx')) as unknown as ZigModule
    zigCache = mod.ZIG_AVAILABLE ? mod : null
  }
  catch {
    zigCache = null
  }
  return zigCache
}

export function dts(options: PluginConfig = {
  root: './src',
  outdir: './dist',
}): BunPlugin {
  return {
    name: 'bun-plugin-dtsx',

    async setup(build) {
      const config = normalizeConfig(options, build)

      const zig = await loadZig()
      if (zig !== null) {
        try {
          await generateViaZig(config, zig)
          return
        }
        catch (err) {
          console.warn(`[bun-plugin-dtsx] zig path failed, falling back to TS: ${(err as Error).message}`)
        }
      }
      await generate(config)
    },
  }
}

function normalizeConfig(options: PluginConfig, build: PluginBuilder): DtsGenerationOption {
  const root = options.root || build.config.root
  const outdir = options.outdir || build.config.outdir

  if (!root)
    throw new Error('[bun-plugin-dtsx] Root directory is required')

  return {
    ...options,
    cwd: options.cwd || process.cwd(),
    root,
    entrypoints: options.entrypoints || ['**/*.ts'],
    outdir,
    clean: options.clean,
    tsconfigPath: options.tsconfigPath,
  }
}

async function generateViaZig(config: DtsGenerationOption, zig: ZigModule): Promise<void> {
  const cwd = config.cwd || process.cwd()
  const root = config.root!
  const outdir = config.outdir
  if (!outdir)
    throw new Error('outdir required for zig path')

  // Resolve root + outdir relative to cwd (config supplies them as paths from the user's project root).
  const rootAbs = join(cwd, root)
  const outdirAbs = join(cwd, outdir)

  // Glob each entrypoint against root; collect relative paths.
  const patterns = (config.entrypoints && config.entrypoints.length > 0) ? config.entrypoints : ['**/*.ts']
  // `globby`-equivalent via Bun.Glob.
  const { Glob } = await import('bun')
  const relFiles = new Set<string>()
  for (const pattern of patterns) {
    const glob = new Glob(pattern)
    for await (const file of glob.scan({ cwd: rootAbs, onlyFiles: true })) {
      // Skip .d.ts inputs — emitting from them is a no-op and confuses path mapping.
      if (file.endsWith('.d.ts'))
        continue
      relFiles.add(file)
    }
  }
  const files = Array.from(relFiles).sort()
  if (files.length === 0)
    return

  // Read all sources in parallel.
  const sources = await Promise.all(
    files.map(f => Bun.file(join(rootAbs, f)).text()),
  )

  // Batch through zig-dtsx (0 = let the lib pick a thread count).
  const dtsOutputs = zig.processBatch(sources, true, 0)
  if (dtsOutputs.length !== files.length)
    throw new Error(`processBatch returned ${dtsOutputs.length} outputs for ${files.length} inputs`)

  // Map each input path to its output .d.ts location and write.
  await Promise.all(dtsOutputs.map(async (dts, i) => {
    const inputRel = files[i]
    const outRel = inputRel.replace(/\.tsx?$/, '.d.ts')
    const outAbs = join(outdirAbs, outRel)
    await mkdir(dirname(outAbs), { recursive: true })
    await Bun.write(outAbs, dts)
  }))
}

export type { DtsGenerationOption }

export default dts
