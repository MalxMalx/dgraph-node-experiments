import * as Router from 'koa-router';
import { getCategory } from '../handlers/category-operations';

// const dgraphOperationManager = require('../operation-manager');

const router = new Router();

// router.post('/category', async ctx => {
//   const {
//     name,
//     description,
//     tagIds // array of strings
//   } = ctx.request.body;

//   try {
//     const result = await dgraphOperationManager.setCategories({
//       name,
//       description,
//       tagIds
//     });

//     ctx.body = result;
//   } catch (error) {
//     if (error.message === 'already exists') {
//       return ctx.throw(400);
//     }

//     ctx.throw(500, error);
//   }
// });

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
