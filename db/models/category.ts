import { Entity, Node, Edge } from '../../orm/model-decorators';
import { TagModel } from './tag';
import { BaseEntity } from '../../orm';

@Entity({ type: 'category' })
export class CategoryModel extends BaseEntity {
  @Edge('string')
  public id: string;

  @Edge('string')
  public name: string;

  @Edge('string')
  public description: string;

  @Edge('string')
  public createdBy: string;

  @Edge('dateTime')
  public createdAt: Date;

  @Edge('dateTime')
  public updatedAt: Date;

  @Node({
    model: TagModel,
    linkType: 'reverse'
  })
  public tags: TagModel[];
}
