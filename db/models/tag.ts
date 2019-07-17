import { Entity, Node, Predicate } from '../../orm/model-decorators';
import { CategoryModel } from './category';

@Entity({ type: 'tag' })
export class TagModel {
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

  @Predicate('')
  public updatedAt: Date;

  @Node('category')
  public categories: CategoryModel[];
}
