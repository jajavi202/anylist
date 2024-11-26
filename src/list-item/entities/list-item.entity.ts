import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('listItems')
export class ListItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number)
  @Column({ type: 'numeric' })
  quantity: number;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  completed: boolean;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.listItems, { lazy: true })
  list: List;

  @Field(() => Item)
  @ManyToOne(() => Item, (item) => item.listItems, { lazy: true })
  item: Item;
}
