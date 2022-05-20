import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListService } from './lists.service';
import { List } from 'src/entities/lists.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([List , User])],
    controllers: [ListsController],
    providers: [ListService],
})
export class ListModule {}
