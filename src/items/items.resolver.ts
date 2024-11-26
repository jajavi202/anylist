import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/shared/dto/args/pagination.args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ) : Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs
  ) : Promise<Item[]> {
    return await this.itemsService.findAll(user, paginationArgs);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('name', { type: () => String }) name: string,
    @CurrentUser() user: User
  ) : Promise<Item> {
    return await this.itemsService.findOne(name);
  }

  @Query(() => Item, { name: 'itemById' })
  async findOneById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ) : Promise<Item> {
    return await this.itemsService.findOneById(id, user);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
  ) : Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ) : Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
