import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id : string;

  @Column('varchar', { length: 30 })
  @Field(() => String)
  name: string;

  @Column('varchar', { length: 40, unique: true })
  @Field(() => String)
  email: string;

  @Column('varchar')
  @Field(() => String)
  password: string;

  @Column({ type: 'text', array: true, default: [ValidRoles.USER] })
  @Field(() => [ValidRoles])
  roles: ValidRoles[];

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  isActive: boolean;

  /// Relationships
  @ManyToOne(() => User, user => user.updateActionUser, { nullable: true, lazy: true })
  @JoinColumn({name: 'updateActionUserId'})
  @Field(() => User, { nullable: true })
  updateActionUser?: User;

  @OneToMany(() => Item, item => item.user, { nullable: true, lazy: true })
  @Field(() => [Item], { nullable: true })
  items?: Item[];
}
