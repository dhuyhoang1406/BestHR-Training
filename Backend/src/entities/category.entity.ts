import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Todo } from './todo.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '#94a3b8' })
  color: string;

  @ManyToMany(() => Todo, (todo) => todo.categories)
  todos: Todo[];
}
