import { CategoryModel } from '../db/models/category';
import { categoryRepository } from '../db/repositories/category';

export async function getCategory(
  categoryId: string,
  name: string
): Promise<CategoryModel> {
  const result = await categoryRepository.get({ id: categoryId, name });
  return result[0];
}
