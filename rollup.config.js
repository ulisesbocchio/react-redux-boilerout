import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  external: [
    'react-redux',
    'redux',
    'reselect'
  ],
  globals: {
    'react': 'React',
    'redux': 'Redux',
    'reselect': 'Reselect',
    'react-redux': 'ReactRedux'
  },
  output: {
    format: 'umd',
  },
  name: 'ReactReduxBoilerOut',
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      plugins: ['transform-es3-property-literals', 'external-helpers'],
      presets: ['es2015-rollup'],
      externalHelpers: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs()
  ]
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      mangle: {
        properties: {
          keep_quoted: true
        }
      },
      output: {
        quote_keys: true,
        keep_quoted_props: true,
        quote_style: 2
      },
      compress: {
        properties: false,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      keep_fnames: true
    })
  )
}

export default config;
