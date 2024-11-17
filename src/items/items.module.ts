import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  providers: [ItemsResolver, ItemsService, JwtAuthGuard],
  imports: [ 
    TypeOrmModule.forFeature([Item]),
  ],
  exports: [ItemsService, TypeOrmModule]
})
export class ItemsModule {}
