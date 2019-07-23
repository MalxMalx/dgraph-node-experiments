import { Repository } from './repository';
import { DgraphClientStub, DgraphClient, Operation } from 'dgraph-js';
import * as grpc from 'grpc';
import { NoConnectionError } from '../errors/no-connection-error';

export interface ConnectionOptions {
  addr: string;
  userId?: string;
  password?: string;
  debugMode?: boolean;
}

export class Client {
  private connectionOptions: ConnectionOptions;
  private dgraphClient: DgraphClient;
  private isConnected: boolean;

  constructor(options: ConnectionOptions) {
    this.connectionOptions = options;
    this.isConnected = false;
  }

  async connect(): Promise<void> {
    const { addr, userId, password, debugMode } = this.connectionOptions;

    const clientStub = new DgraphClientStub(addr, grpc.credentials.createInsecure());

    if (userId) {
      await clientStub.login(userId, password);
    }

    this.dgraphClient = new DgraphClient(clientStub);

    if (debugMode) {
      this.dgraphClient.setDebugMode(true);
    }
    this.isConnected = true;
  }

  getRepository<T>(entityType: { new (): T }) {
    return new Repository<T>(this, entityType);
  }

  async query(query: string): Promise<any> {
    this.assertConnection();
    const queryResult = await this.dgraphClient.newTxn().query(query);
    return queryResult.getJson();
  }

  async setSchemas(schemas: string): Promise<void> {
    this.assertConnection();
    const op = new Operation();
    op.setSchema(schemas);
    await this.dgraphClient.alter(op);
  }

  private assertConnection() {
    if (!this.isConnected) {
      throw new NoConnectionError();
    }
  }
}
