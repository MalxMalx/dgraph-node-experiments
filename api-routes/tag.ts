import * as Router from 'koa-router';
import { getTagById } from '../handlers/tag-operations';

const router = new Router();

router.get('/tag/:id', async ctx => {
  const { id } = ctx.params;

  const getResult = await getTagById(id);

  if (!getResult) {
    return ctx.throw(404);
  }

  ctx.body = getResult;
});

export default router;
