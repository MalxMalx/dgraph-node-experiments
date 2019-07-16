import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import tagRouter from './api-routes/tag';
import categoryRouter from './api-routes/category';
const createDgraphSchema = require('./create-schema');

const PORT = 6001;
const app = new Koa();

(async () => {
  await createDgraphSchema();

  app.use(bodyParser());
  app.use(tagRouter.routes());
  app.use(categoryRouter.routes());
  app.listen(PORT, () => console.log(`App started on port ${PORT}`));
})();
