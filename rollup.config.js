import esbuild from 'rollup-plugin-esbuild';
import { nodeExternals } from 'rollup-plugin-node-externals';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

export default {
  input: 'src/index.ts',

  output: {
    format: 'es',
    entryFileNames: '[name].js',
    dir: 'dist',
    preserveModules: true,
    sourcemap: false,
  },

  plugins: [
    nodeExternals(),
    typescriptPaths({ preserveExtensions: true }),
    esbuild({ sourceMap: false, target: 'es2022' }),
  ],
};
