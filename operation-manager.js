const dgraph = require('dgraph-js');
const dgraphClient = require('./dgraph-connection');
const uuidv4 = require('uuid/v4');

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

const queryByUid = `query all($uid:  uid) {
  all(func: uid($uid))
  {
    ${allFields}
  }
}`;

const queryById = `query all($id: string) {
  all(func: eq(id, $id))
  {
    ${allFields}
  }
}`;

function getQueryParams(entity) {
  let query;
  let vars;

  if (entity.uid) {
    query = queryByUid;
    vars = {
      $uid: entity.uid
    };
  } else if (entity.id) {
    query = queryById;
    vars = {
      $id: entity.id
    };
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
  const { query, vars } = getQueryParams(entity);
  const queryResult = await dgraphClient.newTxn().queryWithVars(query, vars);

  return queryResult.getJson().all;
}

async function getArrayByIds(ids) {
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
  const existingEntity = await get(entity);
  const date = new Date();

  if (existingEntity.length) {
    throw new Error('already exists');
  }
  entity.id = uuidv4();
  entity.createdAt = date;
  entity.updatedAt = date;

  if (entity.categoryIds) {
    const categories = await getArrayByIds(entity.categoryIds);

    entity.tagCategory = categories.map(item => ({ uid: item.uid }));
  }

  const mu = new dgraph.Mutation();

  mu.setSetJson(entity);

  const txn = dgraphClient.newTxn();

  await txn.mutate(mu);
  await txn.commit();

  const getResult = await get(entity);

  return getResult[0];
}

async function setCategories(categoryInfo) {
  const existingEntity = await get(categoryInfo);

  if (existingEntity.length) {
    throw new Error('already exists');
  }

  categoryInfo.id = uuidv4();

  const mu = new dgraph.Mutation();

  mu.setSetJson(categoryInfo);
  const txn = dgraphClient.newTxn();

  await txn.mutate(mu);
  await txn.commit();

  const getResult = await get(categoryInfo);

  if (categoryInfo.tagIds) {
    const tags = await getArrayByIds(categoryInfo.tagIds);

    const updatedTags = tags.map(tag => ({
      ...tag,
      updatedAt: new Date(),
      tagCategory: { uuid: getResult.uid }
    }));

    categoryInfo['~tagCategory'] = tags.map(item => ({ uid: item.uid })); // does not work =(
  }
  return getResult[0];
}

module.exports = {
  get,
  setTag,
  setCategories
};
