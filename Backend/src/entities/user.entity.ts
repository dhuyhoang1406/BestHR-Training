import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Todo } from './todo.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
