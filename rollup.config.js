import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/ammo.js',
    output: {
      file: 'public/ammo.wasm.js',
      format: 'es'
    },
    plugins: [
      alias({
        entries: {
          fs: require.resolve('./scripts/shims/noop'),
          path: require.resolve('./scripts/shims/noop')
        }
      }),
      nodeResolve(),
      commonjs(),
      copy({
        targets: [
          { src: 'node_modules/ammo.js/builds/ammo.wasm.wasm', dest: 'public' }
        ]
      })
    ]
  }
]
