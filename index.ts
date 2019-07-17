import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import tagRouter from './api-routes/tag';
import categoryRouter from './api-routes/category';
import { client } from './dgraph-connection';
const createDgraphSchema = require('./create-schema');

const PORT = 6001;
const app = new Koa();

(async () => {
  await client.connect();
  await createDgraphSchema();

  app.use(bodyParser());
  app.use(tagRouter.routes());
  app.use(categoryRouter.routes());
  app.listen(PORT, () => console.log(`App started on port ${PORT}`));
})();
