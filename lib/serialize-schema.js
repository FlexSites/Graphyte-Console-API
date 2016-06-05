'use strict';

module.exports = (schemaList) => {
  var schemas = schemaList.reduce((results, schemata) => {
    if (schemata.definition) results.typeDefs.push(`${schemata.type || 'type'} ${schemata.type === 'schema' ? '' : schemata.name} { ${schemata.definition} }`);
    if (schemata.resolve) {
      results.resolvers.push(schemata.resolve);
    }
    if (schemata.mock) results.mocks.push(schemata.mock);
    return results;
  }, { typeDefs: [], resolvers: [], mocks: [] });

  schemas.resolvers.unshift({});

  schemas.resolvers = Object.assign({}, ...schemas.resolvers);

  return schemas;
}
