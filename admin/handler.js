'use strict';

const execute = require('./index');

module.exports.handler = function(event, context) {
  execute(event)
    .asCallback(context.done.bind(context));
};
