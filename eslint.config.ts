import type { Linter } from 'eslint'
import stacks from '@stacksjs/eslint-config'

const config = stacks({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  jsonc: true,
  yaml: true,
  ignores: [
    'fixtures/**',
  ],
}) as unknown as Linter.FlatConfig[]

export default config
