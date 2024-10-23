import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(@Args('createItemInput') createItemInput: CreateItemInput) : Promise<Item> {
    return await this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll() : Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('name', { type: () => String }) name: string) : Promise<Item> {
    return await this.itemsService.findOne(name);
  }

  @Query(() => Item, { name: 'itemById' })
  async findOneById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) : Promise<Item> {
    return await this.itemsService.findOneById(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }) id: string) : Promise<Item> {
    return this.itemsService.remove(id);
  }
}
