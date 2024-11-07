import type { DtsGenerationOption } from '@stacksjs/dtsx'
import type { BunPlugin } from 'bun'
import process from 'node:process'
import { generate } from '@stacksjs/dtsx'

export function dts(options?: DtsGenerationOption): BunPlugin {
  return {
    name: 'bun-plugin-dtsx',

    async setup(build) {
      const cwd = options?.cwd || process.cwd()
      const root = options?.root || build.config.root
      const entrypoints = options?.entrypoints // || build.config.entrypoints - we are not resorting to this yet because the `bundle` dtsx option is not yet supported
      const outdir = options?.outdir || build.config.outdir
      const clean = options?.clean || false
      const tsconfigPath = options?.tsconfigPath || './tsconfig.json'
      // const keepComments = options?.keepComments || true

      await generate({
        ...options,
        cwd,
        root,
        entrypoints,
        outdir,
        clean,
        tsconfigPath,
        // keepComments,
      })
    },
  }
}

export { generate }

export type { DtsGenerationOption }

export default dts
