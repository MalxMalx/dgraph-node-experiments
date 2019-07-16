const dgraph = require('dgraph-js');
const dgraphClient = require('./dgraph-connection');

const tagSchema = `
id: string @index(term) .
name: string @index(exact) .
tagCategory: uid .
description: string .
type: string .
createdBy: string .
createdAt: dateTime .
updatedAt: dateTime .
`;

async function createSchema(schema) {
  const op = new dgraph.Operation();
  op.setSchema(schema);
  await dgraphClient.alter(op);
}

module.exports = () => createSchema(tagSchema);
