'use strict';

const redis = require('redis');
const Bluebird = require('bluebird');

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient('redis://h:p6ljnftvactfk1pmetmuovm18b@ec2-54-225-115-56.compute-1.amazonaws.com:18459')
module.exports = (req, res, next) => {
  let platformId = req.get('Graphyte-Platform');

  if (!platformId) return next(new Error('"Graphyte-Platform" ID header must be present.'));



  client
    .getAsync(platformId)
    .then()
}
