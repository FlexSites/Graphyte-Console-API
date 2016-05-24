'use strict';

const DynamoDB = require('./DynamoDb');

const TABLE_NAME = 'Schema';

module.exports = class Schema extends DynamoDB {
  constructor(platformId) {
    super(TABLE_NAME, ['id', 'name', 'type', 'platform', 'mock', 'resolve']);
    this.platformId = platformId;
  }

  list() {
    let params = this.buildQuery(this.platformId, 'platform');
    return this.query(params);
  }

  findById(id) {
    let params = this.buildQuery(id);
    params.KeyConditionExpression += ' and platform = :pkey';
    params.ExpressionAttributeValues[':pkey'] = this.platformId;
    console.log('querying', params);
    return this.query(params);
  }

  put(entry) {
    entry.platform = this.platformId;
    return super.put(entry);
  }
}


