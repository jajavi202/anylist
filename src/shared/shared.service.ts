import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { randomInt } from 'crypto';

@Injectable()
export class SharedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seed(): Promise<boolean> {
        if (this.isProd) {
            throw new BadRequestException('Seed is not allowed in production');
        }
        
        // Delete all users
        await this.deleteUsers();

        // Create users
        await this.loadUsers();

        // Create items
        await this.loadItems();

        return true;
    }

    async deleteUsers(): Promise<void> {
        await this.itemRepository.delete({});
        await this.userRepository.delete({});
    }

    async loadUsers(): Promise<User> {  
        const users = [];

        for (const seedUser of SEED_USERS) {
            const newUser = await this.usersService.create(seedUser);
            users.push(newUser);
        }

        return users[0];
    }

    async loadItems(): Promise<Item> {
        const items = [];

        var i: number = 0;
        const users = await this.userRepository.find();
        for (const seedItem of SEED_ITEMS) {
            const n = randomInt(0, 2);
            const newItem = await this.itemsService.create(seedItem, users[n]);
            items.push(newItem);
        }

        return items[0];
    }
}
