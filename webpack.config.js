const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
};

const clientConfig = {
  ...commonConfig,

  target: 'web',

  devtool: 'inline-source-map',

  entry: {
    index: './app/index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/public'),
    publicPath: '/',
  },

  plugins: [new HtmlWebpackPlugin({ title: 'MFA Demo' })],
};

const serverConfig = {
  ...commonConfig,

  target: 'node',

  entry: {
    server: './server/server.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};

module.exports = [clientConfig, serverConfig];
