import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/shared/dto/args/pagination.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
    if (!itemRepository) throw new InternalServerErrorException('itemRepository is null');
  }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user: user });
    return await this.itemRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<Item[]> {
    return this.itemRepository.find({ take: paginationArgs.take, skip: paginationArgs.skip, where: { user: user } });
  }

  async findOne(name: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ name: name });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async findOneById(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id, user: user });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    const item = await this.itemRepository.preload({ id: id, ...updateItemInput, user: user });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    return this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOneById(id, user);

    return this.itemRepository.remove(item);
  }

  async countItems(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
