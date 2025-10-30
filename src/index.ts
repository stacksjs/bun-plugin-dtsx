import type { DtsGenerationOption } from '@stacksjs/dtsx'
import type { BunPlugin } from 'bun'
import fs from 'node:fs'
import { generate } from '@stacksjs/dtsx'

/**
 * Configuration interface extending DtsGenerationOption with build-specific properties
 */
interface PluginConfig extends DtsGenerationOption {
  build?: {
    config: {
      root?: string
      outdir?: string
    }
  }
}

/**
 * Creates a Bun plugin for generating TypeScript declaration files
 * @param options - Configuration options for DTS generation
 * @returns BunPlugin instance
 */
export function dts(options: PluginConfig = {
  root: './src',
  outdir: './dist',
}): BunPlugin {
  return {
    name: 'bun-plugin-dtsx',

    async setup(build) {
      const config = normalizeConfig(options, build)
      if (config.clean && config.outdir) {
        try {
          fs.rmSync(config.outdir, { recursive: true, force: true })
        }
        catch {}
        fs.mkdirSync(config.outdir, { recursive: true })
      }
      await generate(config)
    },
  }
}

/**
 * Normalizes and validates the configuration
 * @param options - User provided options
 * @param build - Build configuration
 * @returns Normalized configuration
 */
function normalizeConfig(options: PluginConfig, build: PluginConfig['build']): DtsGenerationOption {
  const root = options.root || build?.config.root
  const outdir = options.outdir || build?.config.outdir

  if (!root) {
    throw new Error('[bun-plugin-dtsx] Root directory is required')
  }

  return {
    cwd: options.cwd ?? root,
    root,
    entrypoints: options.entrypoints,
    outdir,
    keepComments: options.keepComments,
    clean: options.clean,
    tsconfigPath: options.tsconfigPath,
    verbose: options.verbose,
    outputStructure: options.outputStructure,
  }
}

export type { DtsGenerationOption }

export default dts
