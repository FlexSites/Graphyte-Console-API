'use strict';

const Bluebird = require('bluebird');
const Platform = require('./services/Platform');
const Schema = require('./services/Schema');
const Auth0 = require('./services/Auth0');
const errors = require('./errors');

const Unauthorized = errors.UnauthorizedError;
const BadRequest = errors.BadRequestError;

let methods = {
  GET: 'list',
  PUT: 'put',
  POST: 'put',
  DELETE: 'delete',
};

const AUTH0_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJQNk9ORTlHeVhyNk5zYUJhUERwa1BKSTJrQmVocGd4SCIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NjMyNTc1OTMsImp0aSI6IjVhYWJhZDRlYTcwMDhhODU0NWU5MzA0NDhmZTcxNTBmIn0.Fz-kIYiBHO0cfsbBiisq3DvHz3012kwkcbbwV4nNlIQ';
const AUTH0_SECRET = 'KbZQI-wUFXkKZpqR4HulY7L1kOtB7-kK9GoG1a0aUTOy9StnkQGcxT83VkGk85Yz';

const auth0 = new Auth0({ token: AUTH0_TOKEN, secret: AUTH0_SECRET });

module.exports = function(event) {
  console.log(event);
  let token = event.token;

  if (!token) return Bluebird.reject(new Unauthorized('Authorization token is required.'));
  console.time('Fetching user');
  return auth0
    .getUserByToken(token.split(' ')[1])
    .then((user) => {
      console.timeEnd('Fetching user');
      console.log('user', user);
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
    });
};

function getResource(name, platformId) {
  if (name === 'entries') return new Schema(platformId);
  else if (name === 'platforms') return new Platform(platformId);
  throw new RangeError(`Unknown resource "${name}"`);
}
