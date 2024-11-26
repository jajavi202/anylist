import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsService } from 'src/items/items.service';
import { ItemsModule } from 'src/items/items.module';
import { SharedModule } from 'src/shared/shared.module';
import { SharedService } from 'src/shared/shared.service';
import { AppModule } from 'src/app.module';
import { PubSub } from 'graphql-subscriptions';
import { ListsModule } from 'src/lists/lists.module';

const pubSub = new PubSub();

@Module({
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  exports: [TypeOrmModule, UsersService, 'PUB_SUB'],
})
export class UsersModule {}
