'use strict';

const express = require('express');
const config = require('config');
const path = require('path');
const json = require('body-parser').json;
// const staticMiddleware = require('./middleware/webpack.dev');

const execute = require('./lib/admin');

const app = express();

app.use(json());
// app.use(staticMiddleware);
// app.use(express.static(path.resolve(__dirname, '../client/dist')));


app.use('/:resource/:id?', (req, res, next) => {
  execute({
    token: req.get('Authorization'),
    platform: req.get('Graphyte-Platform'),
    id: req.params.id,
    path: req.originalUrl,
    payload: req.body,
    method: req.method,
  })
  .then(res.send.bind(res))
  .catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;

  res
    .status(status)
    .send({
      message: err.message || 'Server Error',
      status: err.status || 500,
    });
})

console.log('listening on ', config.get('port'));
app.listen(
  config.get('port'),
  () => console.log(`Booted on port ${config.get('port')}`)
);
