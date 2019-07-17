import * as dgraph from 'dgraph-js';

import * as uuidv4 from 'uuid/v4';
import { getArrayDifferences } from './helpers/get-array-differences';

const allFields = `uid
expand(_all_){
  uid
  expand(_all_)
}`;

const queryByName = `query all($name: string) {
  all(func: eq(name, $name))
  {
    ${allFields}
  }
}`;

const queryByUid = `query all($_uid) {
  all(func: uid($_uid))
  {
    ${allFields}
  }
}`;

const queryById = (id: string) => `{ 
  all(func: eq(id, ${id})){
    ${allFields}
  }
}`;

function getQueryParams(entity) {
  let query;
  let vars;

  if (entity.uid) {
    query = queryByUid;
    vars = {
      $_uid: entity.uid
    };
  } else if (entity.id) {
    query = queryById(entity.id);
  } else if (entity.name) {
    query = queryByName;
    vars = {
      $name: entity.name
    };
  }

  if (!query) {
    throw new Error('entity must contain either uid, id, name');
  }

  return {
    query,
    vars
  };
}

async function get(entity) {
  const dgraphClient = await getClient();
  const { query, vars } = getQueryParams(entity);
  let queryResult;
  if (vars) {
    queryResult = await dgraphClient.newTxn().queryWithVars(query, vars);
  } else {
    queryResult = await dgraphClient.newTxn().query(query);
  }

  return queryResult.getJson().all;
}

async function getArrayByIds(ids) {
  const dgraphClient = await getClient();

  const query = `query all($ids: string) {
    all(func: anyofterms(id, $ids))
    {
      ${allFields}
    }
  }`;

  const vars = { $ids: ids.join(' ') };

  const queryResult = await dgraphClient.newTxn().queryWithVars(query, vars);

  return queryResult.getJson().all;
}

async function setTag(entity) {
  const dgraphClient = await getClient();

  const existingEntity = await get(entity);
  const date = new Date();

  if (existingEntity.length) {
    throw new Error('already exists');
  }
  entity.uid = '_:newTag';
  entity.id = uuidv4();
  entity.type = 'tag';
  entity.createdAt = date;
  entity.updatedAt = date;

  if (entity.categoryIds) {
    const categories = await getArrayByIds(entity.categoryIds);

    entity.categories = categories.map(item => ({
      uid: item.uid,
      tags: { uid: entity.uid }
    }));
  }

  const mu = new dgraph.Mutation();

  mu.setSetJson(entity);

  const txn = dgraphClient.newTxn();

  const mutateResponse = await txn.mutate(mu);
  await txn.commit();

  const getResult = await get({ uid: mutateResponse.getUidsMap().arr_[0][1] });

  return getResult[0];
}

async function updateTag(tagId, tagData) {
  const dgraphClient = await getClient();

  const tagSearchResult = await get({ id: tagId });

  if (!tagSearchResult.length) {
    throw new Error('Tag was not found');
  }

  const existedTag = tagSearchResult[0];
  const { name, description, categoryIds } = tagData;
  existedTag.name = name;
  existedTag.description = description;
  existedTag.updated = new Date();

  const mu = new dgraph.Mutation();

  if (categoryIds) {
    const existedCategoryUids = (existedTag.categories || []).map(
      item => item.uid
    );
    const categories = await getArrayByIds(categoryIds);
    const newCategoryUids = categories.map(item => item.uid);

    const { toRemove } = getArrayDifferences<string>(
      existedCategoryUids,
      newCategoryUids
    );

    if (toRemove.length) {
      const deleteMu = new dgraph.Mutation();
      deleteMu.setDeleteJson({
        uid: existedTag.uid,
        categories: toRemove.map(item => ({ uid: item }))
      });
      const deleteTxn = dgraphClient.newTxn();
      await deleteTxn.mutate(deleteMu);
      await deleteTxn.commit();
    }
    existedTag.categories = categories.map(item => ({
      uid: item.uid,
      tags: { uid: existedTag.uid }
    }));
  }

  mu.setSetJson(existedTag);

  const txn = dgraphClient.newTxn();

  await txn.mutate(mu);
  await txn.commit();

  const getResult = await get({ uid: existedTag.uid });

  return getResult[0];
}

async function deleteTag(tagId) {
  const dgraphClient = await getClient();

  const tagSearchResult = await get({ id: tagId });

  if (!tagSearchResult.length) {
    throw new Error('Tag was not found');
  }
  const mu = new dgraph.Mutation();
  mu.setDeleteJson({
    uid: tagSearchResult[0].uid
  });

  const txn = dgraphClient.newTxn();

  await txn.mutate(mu);
  await txn.commit();
}

async function setCategories(categoryInfo) {
  const dgraphClient = await getClient();

  const existingEntity = await get(categoryInfo);

  if (existingEntity.length) {
    throw new Error('already exists');
  }

  categoryInfo.uid = '_:newCategory';
  categoryInfo.type = 'category';
  categoryInfo.id = uuidv4();

  if (categoryInfo.tagIds) {
    const tags = await getArrayByIds(categoryInfo.tagIds);

    categoryInfo.tags = tags.map(tag => ({
      uid: tag.uid,
      categories: { uid: categoryInfo.uid }
    }));
  }

  const mu = new dgraph.Mutation();

  mu.setSetJson(categoryInfo);
  const txn = dgraphClient.newTxn();

  await txn.mutate(mu);
  await txn.commit();

  const getResult = await get({ id: categoryInfo.id });

  return getResult[0];
}

module.exports = {
  get,
  setTag,
  setCategories,
  updateTag,
  deleteTag
};
