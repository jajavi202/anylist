import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('varchar')
  @Field(() => String)
  name: string;

  @Column('varchar', { length: 10, nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string; // g, ml, kg, l, etc.)

  /// Relationships
  @ManyToOne(() => User, (user) => user.items, { lazy: true, nullable: false })
  @Index('user-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItems: ListItem[];
}
