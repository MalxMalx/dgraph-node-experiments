const dgraph = require('dgraph-js');
const dgraphClient = require('./dgraph-connection');

const allFields = `uid
expand(_all_){
  uid
  expand(_all_) {
    expand(_all_)
  }
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

async function get(entity) {
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

  const queryResult = await dgraphClient.newTxn().queryWithVars(query, vars);

  return queryResult.getJson();
}

async function set(entity) {
  const existedEntity = await get(entity);
  const date = new Date();

  if (existedEntity.length) {
    entity.uid = existedEntity[0].uid;
  } else {
    entity.createdAt = date;
  }
  entity.updatedAt = date;

  const mu = new dgraph.Mutation();

  mu.setSetJson(entity);

  const txn = dgraphClient.newTxn();
  const assigned = await txn.mutate(mu);

  await txn.commit();
  return assigned;
}

module.exports = {
  get,
  set
};
