import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/ammo.js',
    output: {
      file: 'public/ammo.wasm.js',
      format: 'es'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      builtins(),
      copy({
        targets: [
          { src: 'node_modules/ammo.js/builds/ammo.wasm.wasm', dest: 'public' }
        ]
      })
    ]
  }
]
