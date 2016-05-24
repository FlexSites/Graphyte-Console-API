/* eslint-env node */
/* eslint strict: 0 */
'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const VENDOR = [
  'babel-polyfill',
  'classnames',
  'immutable',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-actions',
  'redux-thunk',
  'reselect'
]
const PATHS = {
  client: path.join(__dirname, 'app'),
  dist: path.join(__dirname, 'dist'),
  publicPath: '/',
  entry: './entry.js',
  output: 'js/[name].js',
  cssOutput: 'css/app.css'
}

const extractCss = new ExtractTextPlugin(PATHS.cssOutput)

const common = {
  context: PATHS.client,
  entry: {
    vendor: VENDOR,
    app: PATHS.entry
  },
  output: {
    path: PATHS.dist,
    filename: PATHS.output
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'transform?envify'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'react'
          ]
        }
      },
      // {
      //   test: /\.css$/,
      //   loader: `style!css?${[
      //     'sourceMap',
      //     'modules',
      //     'importLoaders=1',
      //     'localIndentName=[name]__[local]__[hash:base64:5]'
      //   ].join('&')}`,
      //   exclude: /node_modules/,
      //   include: /flexboxgrid/,
      // }
      {
        test: /\.css$/,
        loader: 'style!css?modules',
        // include: /flexboxgrid/,
      }
    ]
  }
}

switch (process.env.NODE_ENV) {

// PRODUCTION CONFIG =========================================================
case 'production':
  module.exports = merge.smart(common, {
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      extractCss
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: extractCss.extract('style', `css?${[
            'sourceMap',
            'modules',
            'importLoaders=1',
            'localIdentName=[hash:base64:5]'
          ].join('&')}`)
        }
      ]
    }
  })
  break

// DEVELOPMENT CONFIG ========================================================
case 'development':
  module.exports = merge.smart(common, {
    devtool: 'eval-source-map',
    devServer: {
      publicPath: PATHS.publicPath,
      quiet: true,
      inline: true,
      contentBase: PATHS.dist
    }
  })
  break

// DEFAULT CONFIG ============================================================
default:
  module.exports = common
  break

}
