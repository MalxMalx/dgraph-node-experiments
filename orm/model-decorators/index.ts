import { UnknownModelError } from '../errors/unknown-model- error';
import { modelMetadataCache } from '../model-metadata-cache';
import { NotSupportEdgeTypeError } from '../errors/not-support-egde-type-error';
import { FacetType } from '../types/facet';

const edgeTypes = ['int', 'float', 'string', 'bool', 'id', 'dateTime', 'geo'];

export function Entity(options: { type: string }) {
  if (!options.type) {
    throw new UnknownModelError();
  }
  return function(constructor: Function) {
    const modelName = constructor.name;
    modelMetadataCache.setEntityType(modelName, options.type);
  };
}

export function Edge(predicateType: string) {
  if (!edgeTypes.includes(predicateType)) {
    throw new NotSupportEdgeTypeError();
  }
  return function(target: any, propertyKey: string) {
    const modelName = target.constructor.name;
    modelMetadataCache.addEdge(modelName, propertyKey, predicateType);
  };
}

export function Node({
  model,
  linkType
}: {
  model: { new () };
  linkType: 'direct' | 'reverse';
}) {
  return function(target: any, propertyKey: string) {
    const modelName = target.constructor.name;
    const relatedModelName = model.name;
    modelMetadataCache.addNode(
      modelName,
      propertyKey,
      relatedModelName,
      linkType === 'direct'
    );
  };
}

export function Facet(type: FacetType) {
  return function(target: any, propertyKey: string) {
    const modelName = target.constructor.name;
    modelMetadataCache.addFacet(modelName, propertyKey, type);
  };
}
