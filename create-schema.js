const dgraph = require('dgraph-js');
const dgraphClient = require('./dgraph-connection');

const tagSchema = `
id: string @index(exact) .
name: string @index(exact) .
tags: uid .
description: string .
categories: uid .
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
