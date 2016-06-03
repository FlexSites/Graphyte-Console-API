'use strict';

const httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8080',
});

module.exports = (req, res) => proxy.web(req, res);
