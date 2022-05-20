import { EntityRepository, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserDto } from './interfaces/users.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  findAllUsers = async () : Promise<User[]> => {
    return await this.find({
      relations: ["entity"],
      select:['id','username','role','status','entity','access','createdAt','updatedAt'],
      order :{
        createdAt :"DESC"
      }
    })
  }
  createUser = async (userDto: UserDto) : Promise<UserDto> => {
    return await this.save(userDto);
  };

  findOneUser = async (username: string ): Promise<User> => {
    return await this.findOne({
      where :{
        username
      },
      relations: ["entity"] , select:['id','username','role','status','entity','access','password']
    })
  };
  
  updateUser = async (id: number, userDto: UserDto):Promise<UpdateResult> => {
    return await this.update({id}  , { ...userDto });
  };

  removeUser = async (ids: number[]):Promise<DeleteResult> => {
    await this.findByIds(ids);
    return await this.delete(ids);
  };
}
