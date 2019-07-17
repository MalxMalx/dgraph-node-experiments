import { client } from '../../dgraph-connection';
import { TagModel } from '../models/tag';

export const tagRepository = client.getRepository<TagModel>(TagModel);
