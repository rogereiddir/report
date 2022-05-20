import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { TeamDto } from './interfaces/team.tdo';
import { TeamRepository } from './teams.repository';


@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(TeamRepository)
        private readonly teamRepository: TeamRepository,
      ) {}
    async findOneCompain(id: number): Promise<Team> {
        const user = await  this.teamRepository.findOneOrFail({
            id,
        });
        return user;
    }
    insertTeam(teamDto : TeamDto ) {
        return this.teamRepository.createTeam(teamDto);
    }

    findAllTeams(): Promise<Team[]> {
       return this.teamRepository.findAllTeams();
    }

    deleteTeam(ids: number[]) {
       return this.teamRepository.removeTeam(ids);
    }
    updateTeam(id: number, data: TeamDto) {
        return this.teamRepository.updateTeam(id , {...data});
    }
}
