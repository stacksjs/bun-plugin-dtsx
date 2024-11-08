// @ts-expect-error - types are missing for now
import type { DtsGenerationOption } from '@stacksjs/dtsx'
import type { BunPlugin } from 'bun'
// @ts-expect-error - types are missing for now
import { generate } from '@stacksjs/dtsx'

export function dts(options?: DtsGenerationOption): BunPlugin {
  return {
    name: 'bun-plugin-dtsx',

    async setup(build) {
      const cwd = options?.cwd
      const root = options?.root || build.config.root
      const entrypoints = options?.entrypoints // || build.config.entrypoints - we are not resorting to this yet because the `bundle` dtsx option is not yet supported
      const outdir = options?.outdir || build.config.outdir
      const clean = options?.clean
      const tsconfigPath = options?.tsconfigPath
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

export type { DtsGenerationOption }

export default dts
