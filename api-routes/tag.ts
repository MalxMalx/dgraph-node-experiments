import * as Router from 'koa-router';

const dgraphOperationManager = require('../operation-manager');
const router = new Router();

router.post('/tag', async ctx => {
  const {
    name,
    description,
    categoryIds // array of strings
  } = ctx.request.body;

  try {
    const result = await dgraphOperationManager.setTag({
      name,
      description,
      categoryIds
    });

    ctx.body = result;
  } catch (error) {
    if (error.message === 'already exists') {
      return ctx.throw(400);
    }

    ctx.throw(500, error);
  }
});

router.get('/tag/:id', async ctx => {
  const { id } = ctx.params;

  const getResult = await dgraphOperationManager.get({ id });

  if (getResult.length === 0) {
    return ctx.throw(404);
  }

  ctx.body = getResult;
});

router.patch('/tag/:id', async ctx => {
  const { id } = ctx.params;
  const tagData = ctx.request.body;

  try {
    ctx.body = await dgraphOperationManager.updateTag(id, tagData);
  } catch (error) {
    console.log(error);
    if (error.message === 'Tag was not found') {
      return ctx.throw(404);
    }
    ctx.throw(500);
  }
});

router.delete('/tag/:id', async ctx => {
  const { id } = ctx.params;

  try {
    await dgraphOperationManager.deleteTag(id);
    ctx.status = 204;
  } catch (error) {
    console.log(error);
    if (error.message === 'Tag was not found') {
      return ctx.throw(404);
    }
    ctx.throw(500);
  }
});

export default router;
