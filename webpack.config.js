const file = require('file-loader');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: './js/app.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.min.js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      })]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Lost Treasures',
        template: './template.html',
        filename: 'index.html',
      }),
    ],
};
