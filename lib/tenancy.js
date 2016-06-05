'use strict';

const Tenancy = require('tenant').Tenancy;
const redis = require('redis');
const Bluebird = require('bluebird');
const { get, set } = require('object-path');
const Platform = require('../services/Platform');
const Schema = require('../services/Schema');

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

const cache = {};

module.exports = new Tenancy({
  tenants: {
    development: {
      redis: 'redis://h:p6ljnftvactfk1pmetmuovm18b@ec2-54-225-115-56.compute-1.amazonaws.com:18459',
    },
  },
  connections: {
    redis(config) {
      let key = [config.env, 'redis'];
      let conn = get(cache, key);
      if (conn) return conn;

      conn = redis.createClient(config.redis);

      set(cache, key, conn);

      return conn;
    },
    platform(config) {
      return new Platform();
    },
    schema(config) {
      return new Schema();
    },
  }
});
