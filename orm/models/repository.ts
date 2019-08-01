import { DgraphClient } from 'dgraph-js';
import { modelMetadataCache, EntityCache } from '../model-metadata-cache';
import { Client } from './client';

export class Repository<T> {
  private entityCache: EntityCache;
  private client: Client;

  constructor(client, entityType: { new (): T }) {
    this.client = client;
    const modelName = entityType.name;
    this.entityCache = modelMetadataCache.getOrCreateItemByModelName(modelName);
  }

  async get(params: Partial<T>): Promise<T[]> {
    let filters = '';

    if (params && Object.keys(params).length) {
      filters = ` @filter(${Object.keys(params)
        .map((key, index) => {
          let result = '';
          if (index > 0) {
            result += ' AND ';
          }
          result += `eq(${key}, "${params[key]}")`;
          return result;
        })
        .join('')})`;
    }

    const query = `
    {
      all(func: eq(type, "${this.entityCache.entityType}")) ${filters} {
        ${this.entityCache.edges.map(item => `${item.name}\n`)}
        ${this.entityCache.nodes.map(node => {
          const nodeEntityType = modelMetadataCache.getItemByEntityType(
            node.entityType
          );

          return `${node.name} {
            ${nodeEntityType.edges.map(item => `${item.name}\n`)}
          }`;
        })}
      }
    }
    `;

    const queryResult = await this.client.query(query);
    return queryResult.all;
  }
}
