import { Entity, Node, Edge, BaseEntity } from '../../orm';
import { CategoryModel } from './category';

@Entity({ type: 'tag' })
export class TagModel extends BaseEntity {
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
    model: CategoryModel,
    linkType: 'direct'
  })
  public categories: CategoryModel[];
}
