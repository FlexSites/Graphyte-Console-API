'use strict';

const request = require('request-promise');
const jwt = require('jsonwebtoken');
const Bluebird = require('bluebird');
const AuthPolicy = require('./AuthPolicy');


const AUTH0_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJQNk9ORTlHeVhyNk5zYUJhUERwa1BKSTJrQmVocGd4SCIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NjMyNTc1OTMsImp0aSI6IjVhYWJhZDRlYTcwMDhhODU0NWU5MzA0NDhmZTcxNTBmIn0.Fz-kIYiBHO0cfsbBiisq3DvHz3012kwkcbbwV4nNlIQ';
const AUTH0_SECRET = 'KbZQI-wUFXkKZpqR4HulY7L1kOtB7-kK9GoG1a0aUTOy9StnkQGcxT83VkGk85Yz';

const verify = Bluebird.promisify(jwt.verify, jwt);

module.exports.handler = function(event, context, cb) {

  try {
    let token = event.authorizationToken.split(' ')[1];
    verify(token, new Buffer(AUTH0_SECRET, 'base64'))
      .then(decoded =>
        request({
          method: 'GET',
          uri: `https://flexhub.auth0.com/api/v2/users/${encodeURIComponent(decoded.sub)}`,
          headers: {
            Authorization: `Bearer ${AUTH0_TOKEN}`,
          },
        })
      )
      .then(user => {
        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        console.log(user);

        // validate the incoming token
        // and produce the principal user identifier associated with the token

        // this could be accomplished in a number of ways:
        // 1. Call out to OAuth provider
        // 2. Decode a JWT token inline
        // 3. Lookup in a self-managed DB
        var principalId = user.user_id;

        // you can send a 401 Unauthorized response to the client by failing like so:
        // context.fail("Unauthorized");

        // if the token is valid, a policy must be generated which will allow or deny access to the client

        // if access is denied, the client will recieve a 403 Access Denied response
        // if access is allowed, API Gateway will proceed with the backend integration configured on the method that was called

        // build apiOptions for the AuthPolicy
        var apiOptions = {};
        if (!event.methodArn) return apiOptions;
        var tmp = event.methodArn.split(':');
        var apiGatewayArnTmp = tmp[5].split('/');
        var awsAccountId = ensureValid(tmp[4]);
        apiOptions.region = ensureValid(tmp[3]);
        apiOptions.restApiId = ensureValid(apiGatewayArnTmp[0]);
        apiOptions.stage = ensureValid(apiGatewayArnTmp[1]);
        var method = ensureValid(apiGatewayArnTmp[2]);
        var resource = '/'; // root resource
        if (apiGatewayArnTmp[3]) {
          resource += apiGatewayArnTmp[3];
        }

        // this function must generate a policy that is associated with the recognized principal user identifier.
        // depending on your use case, you might store policies in a DB, or generate them on the fly

        // keep in mind, the policy is cached for 5 minutes by default (TTL is configurable in the authorizer)
        // and will apply to subsequent calls to any method/resource in the RestApi
        // made with the same token

        // the example policy below denies access to all resources in the RestApi
        var policy = new AuthPolicy(principalId, awsAccountId, apiOptions);

        // policy.denyAllMethods();
        policy.allowMethod(policy.HttpVerb.GET, '/entries');
        policy.allowMethod(policy.HttpVerb.POST, '/entries');
        policy.allowMethod(policy.HttpVerb.GET, '/entries/*');
        policy.allowMethod(policy.HttpVerb.PUT, '/entries/*');
        policy.allowMethod(policy.HttpVerb.DELETE, '/entries/*');

        policy.allowMethod(policy.HttpVerb.GET, '/platforms');
        policy.allowMethod(policy.HttpVerb.POST, '/platforms');
        policy.allowMethod(policy.HttpVerb.GET, '/platforms/*');
        policy.allowMethod(policy.HttpVerb.PUT, '/platforms/*');
        policy.allowMethod(policy.HttpVerb.DELETE, '/platforms/*');

        // finally, build the policy and exit the function using context.succeed()
        let finished = policy.build();
        finished.principalId = user.user_id;
        finished.policyDocument.Statement.push({
          Sid: 'AccessAllPlatformSchema',
          Effect: 'Allow',
          Action: 'dynamodb:*',
          Resource: [
            `arn:aws:dynamodb:us-west-2:${awsAccountId}:table/Platform`,
            `arn:aws:dynamodb:us-west-2:${awsAccountId}:table/Platform/index/*`,
            `arn:aws:dynamodb:us-west-2:${awsAccountId}:table/Schema`,
            `arn:aws:dynamodb:us-west-2:${awsAccountId}:table/Schema/index/*`,
          ],
        });

        console.log(JSON.stringify(finished, null, 2));

        return finished;
      })
      .then(context.succeed.bind(context))
      .catch(() => context.fail('Unauthorized'));
  } catch(ex) {
    cb(ex);
  }
};


function ensureValid(val) {
  if (!val || val === 'null') return false;
  return val;
}
