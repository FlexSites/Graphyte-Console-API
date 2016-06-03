'use strict';

const Service = require('./Service');
const Bluebird = require('bluebird');
const { graphql } = require('graphql');

module.exports = class GraphQL extends Service {
  constructor(config) {
    super('GraphQL');
    this.schema = Bluebird.resolve(config.schema);
  }

  execute(query, context, variables) {
    return this.schema.then(schema => {
      return graphql(schema, query, variables, context);
    })
  }
}
