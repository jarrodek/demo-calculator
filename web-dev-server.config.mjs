/* eslint-disable import/no-extraneous-dependencies */
import { esbuildPlugin } from '@web/dev-server-esbuild';

const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: "/",
  /** Use regular watch mode if HMR is not enabled. */
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ["browser", "development"],
  },

  // nodeResolve: true,
  
  // mimeTypes: {
  //   // serve all json files as js
  //   // '**/*.json': 'js',
  //   // serve .module.css files as js
  //   '**/monaco-editor/esm/vs/editor/standalone/**/.css': 'js',
  // },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'demo/index.html',

  plugins: [
    esbuildPlugin({ ts: true, target: "es2020" }),
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],

  // preserveSymlinks: true,

  // See documentation for all available options

//   middleware: [],
});