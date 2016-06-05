'use strict';

const express = require('express');
const config = require('config');
const authentication = require('./middleware/authentication');
const json = require('body-parser').json;
const tenancy = require('./lib/tenancy');
const cors = require('cors');
const { BadRequestError } = require('./lib/errors');
const { PLATFORM_HEADER } = require('./constants');

const execute = require('./lib/admin');

const app = express();

app.use(json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
})

app.use('/api/:resource/:id?', authentication, (req, res, next) => {

  execute({
    token: req.get('Authorization'),
    platform: req.get(PLATFORM_HEADER),
    id: req.params.id,
    path: req.originalUrl.substr(4),
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
