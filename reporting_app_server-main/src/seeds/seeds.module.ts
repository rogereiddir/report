import { Module } from '@nestjs/common';
import { SeedController } from './seeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seeds.service';
import { ListService } from '../lists/lists.service';
import { Seed } from 'src/entities/seeds.entity';
import { List } from 'src/entities/lists.entity';
import { User } from 'src/entities/user.entity';
import { ResultsService } from 'src/results/results.service';
import { Result } from 'src/entities/results.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Seed  , List , Result , User])],
    controllers: [SeedController],
    providers: [SeedService , ListService ,ResultsService],
})
export class SeedModule {}
