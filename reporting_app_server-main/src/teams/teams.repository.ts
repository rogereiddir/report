import { EntityRepository, Repository, DeleteResult, UpdateResult, InsertResult } from 'typeorm';
import { TeamDto } from './interfaces/team.tdo';
import { Team } from 'src/entities/teams.entity';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  findAllTeams = async () : Promise<Team[]> => {
    return await this.find({
      order :{
        createdAt :"DESC"
      }
    })
  }
  createTeam = async (teamDto: TeamDto) : Promise<InsertResult> => {
    return await this.insert(teamDto);
  };

  findOneTeam= async (id: number ): Promise<Team> => {
    return this.findOneOrFail(id);
  };
  
  updateTeam = async (id: number, teamDto: TeamDto):Promise<UpdateResult> => {
    return this.update({id}, { ...teamDto });
  };

  removeTeam = async (ids: number[]):Promise<DeleteResult> => {
    return this.delete(ids);
  };
}
