import * as dgraph from 'dgraph-js';
import { client } from './dgraph-connection';

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
  await client.setSchemas(schema);
}

module.exports = () => createSchema(tagSchema);
