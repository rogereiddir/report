import { CacheModule, Module } from '@nestjs/common';
import { ProcessController } from './processes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from '../entities/process.entity';
import { ProcessService } from './processes.service';
import { ListService } from 'src/lists/lists.service';
import { List } from 'src/entities/lists.entity';
import { User } from 'src/entities/user.entity';
import { Result } from 'src/entities/results.entity';
import { ResultsService } from 'src/results/results.service';
import { Seed } from 'src/entities/seeds.entity';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath:'.env'
        }),
        CacheModule.register({
            store:redisStore,
            host: 'localhost',
            port: 6379
         }),
        TypeOrmModule.forFeature([Process , List , User , Result , Seed])
    ],
    controllers: [ProcessController],
    providers: [ProcessService , ListService , ResultsService],
})
export class ProcessModule {}
