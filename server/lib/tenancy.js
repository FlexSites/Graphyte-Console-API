'use strict';

const Tenancy = require('tenant');

let tenants = new Tenancy({
  connections: {
    graphql(tenantId) {

    }
  }
})

let stages = new Tenancy({

})
