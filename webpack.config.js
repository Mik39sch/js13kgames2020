module.exports = {
    mode: 'production',
    entry: './js/app.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.min.js'
    }
  };