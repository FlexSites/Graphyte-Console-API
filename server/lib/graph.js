'use strict';

const makeExecutableSchema = require('./parse-schema').makeExecutableSchema;

module.exports = (schemaList) => {
  var schemas = schemaList.reduce((results, schemata) => {
    if (schemata.name === 'Initial') {
      results.initial = schemata;
      return results;
    }
    if (schemata.definition) results.types.push(`${schemata.type || 'type'} ${schemata.type === 'schema' ? '' : schemata.name} { ${schemata.definition} }`);
    if (schemata.resolve) {
      let resolve = parseResolve(schemata.resolve);
      // results.resolves.push({ [schemata.name]: resolve });
      results.resolves.push(resolve);
    }
    if (schemata.mock) results.mocks.push(schemata.mock);
    return results;
  }, { types: [], resolves: [], mocks: [], initial: {} });

  schemas.resolves.unshift({});

  console.log(schemas.types);

  return makeExecutableSchema({
    typeDefs: schemas.types,
    resolvers: Object.assign.apply(Object, schemas.resolves),
  });
}

function parseResolve(resolve) {
  return Object.keys(resolve)
    .reduce((prev, curr) => {
      let val = resolve[curr];
      if (typeof val === 'string') prev[curr] = (new Function('source', 'params', 'info', val));
      else if (typeof val === 'object') prev[curr] = parseResolve(val);
      console.log('stuff', prev[curr].toString());
      if (typeof prev[curr] === 'function') prev[curr]({ id: 'seth' }, { id: 'notseth' }, { info: 'seth' });
      return prev;
    }, {});
}
