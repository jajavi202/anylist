import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Field(() => String)
  quantityUnits?: string; // g, ml, kg, l, etc.

}
