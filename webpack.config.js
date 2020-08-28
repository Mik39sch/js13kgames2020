const TerserPlugin = require('terser-webpack-plugin');
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
    }
};
// module.exports = {

//   };