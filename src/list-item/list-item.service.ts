import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  create(createListItemInput: CreateListItemInput) {
    const { itemId, listId, ...rest } = createListItemInput;

    const listItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    return this.listItemRepository.save(listItem);
  }

  findAll(list: List): Promise<ListItem[]> {
    return this.listItemRepository.find({ where: { list } });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
