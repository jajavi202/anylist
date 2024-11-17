import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsService } from 'src/items/items.service';
import { ItemsModule } from 'src/items/items.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ItemsModule,
    SharedModule
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
