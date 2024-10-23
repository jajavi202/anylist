import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ){
    if (!itemRepository) throw new InternalServerErrorException('itemRepository is null');
  }

  async create(createItemInput: CreateItemInput) : Promise<Item> {
    const newItem = this.itemRepository.create(createItemInput);
    return await this.itemRepository.save(newItem);
  }

  async findAll() : Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(name: string) : Promise<Item> {
    const item = await this.itemRepository.findOneBy({ name: name });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async findOneById(id: string) : Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput) {
    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    return this.itemRepository.save( item );
  }

  async remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
