'use strict';

const Service = require('./Service');
const Bluebird = require('bluebird');
const mongoose = require('mongoose');

const _put = Symbol('put');


module.exports = class DynamoDB extends Service {
  constructor(tenantID) {
    super(`${tableName} | DynamoDB`);

    this.tenant = tenantID;

    this.put = this[_put].bind()

  }

  put(tableName, obj) {

  }
}
