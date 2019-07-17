import { Client } from './orm';

export const client = new Client({
  addr: 'localhost:9080',
  debugMode: true
});
