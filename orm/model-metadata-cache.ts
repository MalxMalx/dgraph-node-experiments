export class EntityCache {
  public modelName: string;
  public entityType: string;
  public predicates: {
    name: string;
    type: string;
  }[];
  public nodes: {
    name: string;
    entityType: string;
  }[];

  constructor(entityName: string) {
    this.modelName = entityName;
    this.predicates = [];
    this.nodes = [];
  }
}

class ModelMetadataCache {
  private entityCache: EntityCache[];

  constructor() {
    this.entityCache = [];
  }

  addPredicate(
    modelName: string,
    propertyName: string,
    predicateType: string
  ): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);

    entityCache.predicates.push({ name: propertyName, type: predicateType });
  }

  addNode(modelName: string, propertyName: string, nodeType): void {
    const entityCache = this.getOrCreateItemByModelName(modelName);
    entityCache.nodes.push({
      name: propertyName,
      entityType: nodeType
    });
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
