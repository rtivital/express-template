import { defineConfig } from 'rolldown';

const externalDependencyPattern = /^(?!@\/)(?:@[^/]+\/)?[^./][^:]*/;

export default defineConfig({
  input: 'src/index.ts',
  platform: 'node',
  tsconfig: './tsconfig.json',
  external: [externalDependencyPattern, /^node:/],
  output: {
    format: 'es',
    entryFileNames: '[name].js',
    dir: 'dist',
    preserveModules: true,
    sourcemap: false,
  },
});
