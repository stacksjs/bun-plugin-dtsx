![Social Card of Bun Plugin dtsx](https://github.com/stacksjs/bun-plugin-dtsx/blob/main/.github/art/cover.png)

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![Codecov][codecov-src]][codecov-href] -->

This Bun plugin generates dts files for your TypeScript projects.

## Features

- Automatic & fast dts generation
- Powered by Bun & isolatedDeclarations
- Monorepo support

## Usage

```bash
bun install -d bun-plugin-dtsx
```

You may now use the plugin:

```ts
import dts from 'bun-plugin-dtsx'
// if you prefer named imports
// import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  root: './src',
  entrypoints: [
    'src/index.ts',
  ],
  outdir: './dist',
  plugins: [
    dts({
      cwd: './', // optional, default: process.cwd()
      root: './src', // optional, default: './src'
      outdir: './dist/types', // optional, default: './dist'
      keepComments: true, // optional, default: true
      tsconfigPath: './tsconfig.json', // optional, default: './tsconfig.json'
    }),
  ],
})

console.log('Build complete ✅')
```

## API

The `dts` plugin accepts an options object with the following properties:

- `cwd`: The current working directory _(optional, default: `process.cwd()`)_
- `root`: The root directory of your TypeScript files _(optional, default: `'src'`)_
- `outdir`: The output directory for generated declaration files _(optional, default: `'./dist'`)_
- `entrypoints`: An array or glob of file paths, or a single file path, to process _(optional, if not specified, defaults to build entrypoints)_
- `keepComments`: Whether to keep comments in the generated dts files _(optional, default: `true`)_
- `tsconfigPath`: The path to your tsconfig file _(optional, default: `'./tsconfig.json'`)_

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stacksjs/bun-plugin-dtsx/releases) page for more information on what has changed recently.

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where `bun-plugin-dtsx` is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

Many thanks to the following core technologies & people who have contributed to this package:

- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/bun-plugin-dtsx/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: <https://img.shields.io/npm/v/bun-plugin-dtsx?style=flat-square>
[npm-version-href]: <https://npmjs.com/package/bun-plugin-dtsx>
[npm-downloads-src]: <https://img.shields.io/npm/dm/bun-plugin-dtsx?style=flat-square>
[npm-downloads-href]: <https://npmjs.com/package/bun-plugin-dtsx>
[github-actions-src]: <https://img.shields.io/github/actions/workflow/status/stacksjs/bun-plugin-dtsx/ci.yml?style=flat-square&branch=main>
[github-actions-href]: <https://github.com/stacksjs/bun-plugin-dtsx/actions?query=workflow%3Aci>

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/bun-plugin-dtsx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/bun-plugin-dtsx -->
