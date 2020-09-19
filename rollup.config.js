import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import pkg from './package.json';

export default {
  input: './src/extension.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: true
  },
  external: [
    "typescript-parser",
    "vscode",
    "path",
    "fs",
    "url",
    "events",
    "stream",
    "util",
    "http",
    "https",
    "tls",
    "os",
    "zlib",
    "dns",
    "http2",
    "net",
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
};
