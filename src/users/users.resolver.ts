import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.args';
import { Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) { }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'blockUser' })
  @UseGuards(JwtAuthGuard)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<User> {
    return await this.usersService.update(updateUserInput, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  @UseGuards(JwtAuthGuard)
  async itemCount(
    @CurrentUser([ValidRoles.ADMIN]) currentUser: User,
    @Parent() user: User
  ): Promise<number> {
    return await this.itemsService.countItems(user);
  }

  @Subscription(() => User, { name: 'subTest',
    resolve: (value) => value
   })
  async subscribeToSubTest() {
    return this.pubSub.asyncIterableIterator('subTest');
  }
}
