import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/shared/dto/args/pagination.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({
      ...createListInput,
      user,
    });

    return await this.listRepository.save(newList);
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<List[]> {
    const { skip, take } = paginationArgs;
    const query = this.listRepository
      .createQueryBuilder('list')
      .take(take)
      .skip(skip)
      .where('list.userId = :userId', { userId: user.id });

    return query.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = this.listRepository.findOneBy({ id, user: { id: user.id } });

    if (!list) {
      throw new NotFoundException(`List #${id} not found`);
    }

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload({
      ...updateListInput,
      user,
    });

    if (!list) throw new NotFoundException(`List #${id} not found`);

    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);

    if (!list) throw new NotFoundException(`List #${id} not found`);

    return this.listRepository.remove(list);
  }

  async countItems(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
