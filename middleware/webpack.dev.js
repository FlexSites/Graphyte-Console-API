'use strict';

const webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const config = require('../../client/webpack.config');

module.exports = new DevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
})
.listen(3000, 'localhost', (err, result) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
