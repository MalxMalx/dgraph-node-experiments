const dgraph = require('dgraph-js');
const grpc = require('grpc');

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
);
const dgraphClient = new dgraph.DgraphClient(clientStub);

module.exports = dgraphClient;
