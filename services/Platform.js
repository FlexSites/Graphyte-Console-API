'use strict';

const DynamoDB = require('./DynamoDb');

const TABLE_NAME = 'Platform';

module.exports = class Platform extends DynamoDB {
  constructor() {
    super(TABLE_NAME, ['id', 'name']);
  }

  list() {
    return this.scan();
  }
}
