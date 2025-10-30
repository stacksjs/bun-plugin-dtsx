import process from 'node:process'
// Do not use the plugin while building itself to avoid interfering with Bun's bundling

console.log('Building...')

const result = await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  target: 'bun',
  external: ['@stacksjs/dtsx'],
  // minify: true,
})

if (!result.success) {
  console.error('Build failed')

  for (const message of result.logs) {
    console.error(message)
  }

  process.exit(1)
}

console.log('Build complete')
