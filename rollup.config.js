import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input      : "./dist/index.js",
  output: {
    file: './build/script.js',
    format: 'cjs'
  },
  plugins    : [
    commonjs(),
    nodeResolve()
  ]
};