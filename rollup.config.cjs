const alias = require('@rollup/plugin-alias')
const copy = require('rollup-plugin-copy')
const { terser } = require('rollup-plugin-terser')
const filesize = require('rollup-plugin-filesize')

const { DEV, PROD } = process.env

const prodPlugins = PROD ? [
  terser({
    compress: {
      drop_console: true,
      ecma: '2020',
      keep_infinity: true,
      passes: 2
    },
    format: {
      comments: false
    }
  }),
  filesize()
] : []

const configs = [
  {
    input: 'node_modules/ammo.js/builds/ammo.wasm.js',
    output: [{
      file: 'public/ammo.js',
      format: 'es'
    }, {
      file: 'build/ammo.js',
      format: 'es'
    }],
    plugins: [
      alias({
        entries: {
          fs: require.resolve('./scripts/noop'),
          path: require.resolve('./scripts/noop')
        }
      }),
      copy({
        targets: [
          {
            src: 'node_modules/ammo.js/builds/ammo.wasm.wasm',
            dest: 'public'
          }
        ]
      }),
      ...prodPlugins
    ]
  }
]

module.exports = configs
