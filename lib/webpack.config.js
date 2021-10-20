const { NodeAsyncHttpRuntime } = require('@telenko/node-mf')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const { dependencies } = require('./package.json')

require('dotenv').config({
  path: '../.env',
})

const { LIB_URL, LIB_PORT } = process.env

/**
 * @param {string} target
 */
const getConfig = (target) => ({
  entry: './src/index.js',
  mode: 'development',
  devtool: 'hidden-source-map',
  target: target === 'web' ? 'web' : false,
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist', target),
    publicPath: `http://${LIB_URL}:${LIB_PORT}/${target}/`,
  },
  devServer: {
    compress: true,
    port: LIB_PORT,
  },
  resolve: {
    extensions: ['.js', '.json', '.jpg', 'jpeg', 'png', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /bootstrap\.js$/,
        loader: 'bundle-loader',
        options: {
          lazy: true,
        },
      },
      {
        test: /\.(jpeg|jpg|png|git)$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jsx|js)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteLib',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),
    ...(target === 'web'
      ? [
          new HtmlWebpackPlugin({
            template: './public/index.html',
          }),
        ]
      : [new NodeAsyncHttpRuntime()]),
  ],
})

module.exports = [getConfig('web'), getConfig('node')]
