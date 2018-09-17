import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
const pkg = require('./package.json')

export default {
  input: './build/index.js',
  output: [
    {
      file: pkg.main,
      name: 'charts',
      format: 'umd',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    commonjs(),
    resolve()
  ],
  onwarn: (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return
    warn(warning)
  }
}
