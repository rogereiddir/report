import { Module } from '@nestjs/common';
import { TeamController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { TeamService } from './teams.service';
import { TeamRepository } from './teams.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Team , TeamRepository])],
    controllers: [TeamController],
    providers: [TeamService],
})
export class TeamModule {}
