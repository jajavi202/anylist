import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { SharedService } from './shared.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SharedResolver } from './shared.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

const pubSub = new PubSub();

@Module({
    providers: [
        SharedService,
        SharedResolver,
    ],
    exports: [],
    imports: [ConfigModule, UsersModule, ItemsModule],
})
export class SharedModule {}
