import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  
  @Column('varchar', { length: 30 })
  @Field(() => String)
  name: string;

  @Column('float')
  @Field(() => Float)
  quantity: number;

  @Column('varchar', { length: 10, nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string; // g, ml, kg, l, etc.)

  /// Relationships
  @ManyToOne(() => User, user => user.items, { lazy: true, nullable:false})
  @Index('user-index')
  @Field(() => User)
  user: User;
}
