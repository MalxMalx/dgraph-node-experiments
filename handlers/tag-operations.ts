import { TagModel } from '../db/models/tag';
import { tagRepository } from '../db/repositories/tag';

export async function getTagById(tagId: string): Promise<TagModel> {
  const result = await tagRepository.get({ id: tagId });
  return result[0];
}
