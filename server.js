'use strict';

const express = require('express');
const config = require('config');
const cors = require('cors');
const json = require('body-parser').json;


const execute = require('./admin');


console.log(execute, typeof execute);
const app = express();

app.use(cors());
app.use(json());

app.use('/:resource/:id?', (req, res, next) => {
  console.log({
    token: req.get('Authorization'),
    platform: req.get('Graphyte-Platform'),
    id: req.params.id,
    path: req.originalUrl,
    payload: req.body,
    method: req.method,
  });
  console.time('execute');
  execute({
    token: req.get('Authorization'),
    platform: req.get('Graphyte-Platform'),
    id: req.params.id,
    path: req.originalUrl,
    payload: req.body,
    method: req.method,
  })
  .tap(() => console.timeEnd('execute'))
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

app.listen(
  config.get('port'),
  () => console.log(`Booted on port ${config.get('port')}`)
);
