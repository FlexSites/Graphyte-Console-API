'use strict';

const express = require('express');
const config = require('config');
const authentication = require('./middleware/authentication');
const json = require('body-parser').json;
const schemaParse = require('./lib/graph');
const staticMiddleware = require('./middleware/static-proxy');
const Schema = require('./services/Schema');

const {
  graphql,
  GraphQLSchema,
} = require('graphql');

// const staticMiddleware = require('./middleware/webpack.dev');

const execute = require('./lib/admin');

const app = express();

app.use(json());
app.use((req, res, next) => {
  console.log('req.url', ~req.url.indexOf('.'), req.url);
  if (~req.url.indexOf('.') || req.url === '/') return staticMiddleware(req, res);
  next();
});

// app.use(staticMiddleware);
// app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.use('/graph', (req, res, next) => {
  const schemaDao = new Schema(req.get('Graphyte-Platform'));
  schemaDao.list()
    .then(schemaParse)
    .then((results) => {
      console.log('BLAH', results instanceof GraphQLSchema);
      return graphql(results, 'mutation { createPage(input: "seth page") { id content } }')
    })
    .then(res.send.bind(res))
    .catch(next);
});

app.use('/:resource/:id?', authentication, (req, res, next) => {
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
