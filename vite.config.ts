import path from 'node:path'
import { defineConfig, normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, './node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm')),
          dest: normalizePath(path.resolve(__dirname, './public'))
        },
      ]
    })
  ],
  worker: {
    format: 'es',
  }
})
