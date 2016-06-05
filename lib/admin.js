'use strict';

const Platform = require('../services/Platform');
const Schema = require('../services/Schema');
const errors = require('./errors');

const BadRequest = errors.BadRequestError;

let methods = {
  GET: 'list',
  PUT: 'put',
  POST: 'put',
  DELETE: 'delete',
};

module.exports = function(event) {
  let platformId = event.platform;
  if (!platformId) throw new BadRequest('"Graphyte-Platform" must be defined."');

  let action = methods[event.method];
  if (event.id && action === 'list') action = 'get';
  console.log('action', action);
  if (!action) throw new BadRequest(`Unknown method "${action}"`);

  let payload = event.id;
  if (action === 'put') payload = event.payload;

  let resourceName = event.path.substr(1).split('/')[0];
  return getResource(resourceName, platformId)[action](payload);
};

function getResource(name, platformId) {
  if (name === 'entries') return new Schema(platformId);
  else if (name === 'platforms') return new Platform(platformId);
  throw new RangeError(`Unknown resource "${name}"`);
}
