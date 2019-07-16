import * as dgraph from 'dgraph-js';
import * as grpc from 'grpc';

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
);
export const dgraphClient = new dgraph.DgraphClient(clientStub);
