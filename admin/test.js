const event = require('./event.json');
const handler = require('./handler').handler;

const context = {
  done: console.log.bind(console, 'done'),
  succeed: console.log.bind(console, 'succeed'),
  fail: console.log.bind(console, 'fail'),
};

handler(event, context);
