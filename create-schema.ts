import * as dgraph from 'dgraph-js';
import { dgraphClient } from './dgraph-connection';

const tagSchema = `
id: string @index(term) .
name: string @index(exact) .
tags: uid .
categories: uid .
description: string .
type: string @index(exact) .
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
