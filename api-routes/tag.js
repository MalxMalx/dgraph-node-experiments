const Router = require('koa-router');
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

module.exports = router;
