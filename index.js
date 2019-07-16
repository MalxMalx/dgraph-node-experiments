const Koa = require('koa');
const bodyParser = require('koa-body');
const tagRouter = require('./api-routes/tag');
const categoryRouter = require('./api-routes/category');
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
