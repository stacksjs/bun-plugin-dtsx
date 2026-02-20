declare module '@stacksjs/dtsx' {
  export interface DtsGenerationConfig {
    cwd: string
    root: string
    entrypoints: string[]
    outdir: string
    keepComments: boolean
    clean: boolean
    tsconfigPath: string
    verbose: boolean | string[]
    outputStructure?: 'mirror' | 'flat'
  }

  export type DtsGenerationOption = Partial<DtsGenerationConfig>

  export function generate(_options?: DtsGenerationOption): Promise<void>
}
