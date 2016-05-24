'use strict';

const fs = require('fs');
const path = require('path');

let requestTemplate = `{
  "method": "$context.httpMethod",
  "token": "$util.escapeJavaScript($input.params('Authorization'))",
  "path": "$context.resourcePath",
  "stage": "$context.stage",
  "payload": $input.json('$'),
  "platform": "$util.escapeJavaScript($input.params('Graphyte-Platform'))",
  "id": "$util.escapeJavaScript($input.params('id'))"
}`;

let endpoints = [
  buildEndpoint('entries', 'GET'),
  buildEndpoint('entries', 'POST'),
  buildEndpoint('entries/{id}', 'GET'),
  buildEndpoint('entries/{id}', 'PUT'),
  buildEndpoint('entries/{id}', 'DELETE'),

  buildEndpoint('platforms', 'GET'),
  buildEndpoint('platforms', 'POST'),
  buildEndpoint('platforms/{id}', 'GET'),
  buildEndpoint('platforms/{id}', 'PUT'),
  buildEndpoint('platforms/{id}', 'DELETE'),
];

function buildEndpoint(resource, method) {
  return {
    path: resource,
    method,
    type: 'AWS',
    authorizationType: 'none',
    apiKeyRequired: false,
    requestParameters: {
      'integration.request.path.Authorization': 'method.request.header.Authorization',
      'integration.request.path.Graphyte-Platform': 'method.request.header.Graphyte-Platform',
      'integration.request.path.Content-Type': 'method.request.header.Content-Type',
    },
    requestTemplates: {
      'application/json': requestTemplate,
    },
    responses: {
      400: {
        selectionPattern: '(Type|Range)Error.*',
        statusCode: '400',
      },
      401: {
        selectionPattern: 'BadRequest.*',
        statusCode: '401',
        responseParameters: {},
        responseModels: {
          'application/json;charset=UTF-8': 'Error',
        },
        responseTemplates: {
          'application/json;charset=UTF-8': '',
        },
      },
      default: {
        statusCode: '200',
        responseParameters: {},
        responseModels: {
          'application/json;charset=UTF-8': 'Empty',
        },
        responseTemplates: {
          'application/json;charset=UTF-8': '',
        },
      },
    },
  };
}

let filepath = path.resolve(__dirname, 's-function.json');
let file = fs.readFileSync(filepath, 'utf8');
file = JSON.parse(file);
file.endpoints = endpoints;
file = JSON.stringify(file, null, 2)
fs.writeFileSync(filepath, file);
