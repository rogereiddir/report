import { AuthIp } from '../entities/authIp.entity';
import { EntityRepository, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { AuthIpDto } from './interfaces/auth_ips.dto';

@EntityRepository(AuthIp)
export class AuthIpRepository extends Repository<AuthIp> {

  findAllIPS = async () : Promise<AuthIp[]> => {
    return await this.find({
      relations:['entity'],
      order :{
        createdAt :"DESC"
      }
    })
  }
  createIP = async (authIpDto: AuthIpDto) : Promise<AuthIpDto> => {
    return await this.save(authIpDto);
  };

  findOneIP = async (id: number ): Promise<AuthIp> => {
    return this.findOneOrFail(id);
  };
  
  updateIP = async (id: number, authIpDto: AuthIpDto):Promise<UpdateResult> => {
    return this.update({ ...authIpDto } , {id});
  };

  removeIP = async (ids: number[]):Promise<DeleteResult> => {
    await this.findByIds(ids);
    return this.delete(ids);
  };
}
