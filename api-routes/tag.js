const dgraphOperationManager = require('./operation-manager');

const router = new Router();

router.post('/tag', async ctx => {
  const {
    name,
    description,
    categoryIds // array of strings
  } = ctx.request.body;

  try {
    const result = await dgraphOperationManager.set({
      name,
      description
    });

    ctx.body = result;
  } catch (error) {
    ctx.throw(500, error);
  }
});

module.exports = router;
