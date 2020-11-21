/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-typescript'
  ],
  exclude: [
    'ammo.js',
    'ammo.wasm.js',
    '**/node_modules/**/*',
    '**/__tests__/*',
    '**/*.@(spec|test).@(js|mjs)'
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    installTypes: true
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
}
