import { FacetType } from './types/facet';

interface BasePredicate {
  name: string;
  type: string;
}

class Node {
  private model: EntityCache;
  private name: string;
  private relatedModel: EntityCache;
  private isDirect: boolean;

  constructor(
    model: EntityCache,
    name: string,
    relatedModel: EntityCache,
    isDirect: boolean
  ) {
    this.model = model;
    this.name = name;
    this.relatedModel = relatedModel;
    this.isDirect = isDirect;
  }

  getName(): string {
    return this.name;
  }

  getQueryParam(): string {
    const entityType = this.model.entityType;
    const relatedEntityType = this.relatedModel.entityType;
    return this.isDirect
      ? `${this.name} : __${entityType}_${relatedEntityType}`
      : `${this.name} : ~__${relatedEntityType}_${entityType}`;
  }
}

export class EntityCache {
  public modelName: string;
  public entityType: string;
  public edges: BasePredicate[];
  public nodes: Node[];
  public facets: BasePredicate[];

  constructor(entityName: string) {
    this.modelName = entityName;
    this.edges = [];
    this.nodes = [];
  }

  addEdge(name: string, type: string) {
    this.edges.push({ name, type });
  }

  addFacet(name: string, type: string) {
    this.facets.push({ name, type });
  }

  addNode(name: string, relatedModel: EntityCache, isDirect: boolean): void {
    this.nodes.push(new Node(this, name, relatedModel, isDirect));
  }
}

class ModelMetadataCache {
  private entityCache: EntityCache[];

  constructor() {
    this.entityCache = [];
  }

  addEdge(modelName: string, propertyName: string, edgeType: string): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);
    entityCache.addEdge(propertyName, edgeType);
  }

  addFacet(modelName: string, propertyName: string, type: FacetType): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);
    entityCache.addFacet(propertyName, type);
  }

  addNode(
    modelName: string,
    propertyName: string,
    relatedModelName,
    isDirect
  ): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);
    const relatedModel = this.getOrCreateItemByModelName(relatedModelName);

    entityCache.addNode(propertyName, relatedModel, isDirect);
  }

  setEntityType(modelName: string, entityType: string): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);
    entityCache.entityType = entityType;
  }

  getOrCreateItemByModelName(modelName: string): EntityCache {
    let entityCacheItem = this.entityCache.find(
      item => item.modelName === modelName
    );

    if (!entityCacheItem) {
      entityCacheItem = new EntityCache(modelName);

      this.entityCache.push(entityCacheItem);
    }

    return entityCacheItem;
  }

  getItemByEntityType(entityType: string) {
    return this.entityCache.find(item => item.entityType === entityType);
  }
}

export const modelMetadataCache = new ModelMetadataCache();
