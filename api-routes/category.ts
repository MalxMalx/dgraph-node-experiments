import * as Router from 'koa-router';
import { getCategory } from '../handlers/category-operations';

const router = new Router();

router.get('/category/:id', async ctx => {
  const { id } = ctx.params;
  const { name } = ctx.query;
  const result = await getCategory(id, name);

  if (!result) {
    return ctx.throw(404);
  }

  ctx.body = result;
});

export default router;
