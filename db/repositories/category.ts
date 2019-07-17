import { client } from '../../dgraph-connection';
import { CategoryModel } from '../models/category';

export const categoryRepository = client.getRepository<CategoryModel>(
  CategoryModel
);
