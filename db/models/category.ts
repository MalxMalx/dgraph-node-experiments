import { Entity, Node, Predicate } from '../../orm/model-decorators';
import { TagModel } from './tag';

@Entity({ type: 'category' })
export class CategoryModel {
  @Predicate('string')
  public id: string;

  @Predicate('string')
  public name: string;

  @Predicate('string')
  public description: string;

  @Predicate('string')
  public createdBy: string;

  @Predicate('dateTime')
  public createdAt: Date;

  @Predicate('dateTime')
  public updatedAt: Date;

  @Node('tag')
  public tags: TagModel[];
}
