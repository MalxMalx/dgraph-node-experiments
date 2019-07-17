import { UnknownModelError } from '../errors/unknown-model- error';
import { modelMetadataCache } from '../model-metadata-cache';

export function Entity(options: { type: string }) {
  if (!options.type) {
    throw new UnknownModelError();
  }
  return function(constructor: Function) {
    const modelName = constructor.name;
    modelMetadataCache.setEntityType(modelName, options.type);
  };
}

export function Predicate(predicateType: string) {
  return function(target: any, propertyKey: string) {
    const modelName = target.constructor.name;
    modelMetadataCache.addPredicate(modelName, propertyKey, predicateType);
  };
}

export function Node(nodeType: string) {
  return function(target: any, propertyKey: string) {
    const modelName = target.constructor.name;
    modelMetadataCache.addNode(modelName, propertyKey, nodeType);
  };
}
