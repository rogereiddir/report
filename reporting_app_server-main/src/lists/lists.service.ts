import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/entities/lists.entity';
import { ListDto } from './interfaces/list.tdo';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

interface Ifilter {
    userId:number,
    entity:number
}
  
@Injectable()
export class ListService {
    constructor(
        @InjectRepository(List) private listRepository: Repository<List>,
        @InjectRepository(User) private userRepository: Repository<User>,
      ) {}

    findOneList(id: number) {
        return  this.listRepository.findOne(id ,{ relations :['seeds' ,'processes'] })
    }

    findOne(id: List) {
        return  this.listRepository.findOne(id ,{ relations :['seeds'] })
    }
    
    insertList(listDto :ListDto) {
        return  this.listRepository.insert(listDto);
    }

    async findAll(user : number): Promise<List[]> {
        const cuser = await this.userRepository.findOne({ 
            where:{
            id:user
           }
        })
        if(cuser.role === 'IT'){
        return this.listRepository.find({
            relations:['user','user.entity'],
            order :{
                createdAt:"DESC"
            }
        })
      }
      return this.listRepository.find({
          relations:['user','user.entity'],
          where :{
              user
          }, 
          order :{
            createdAt:"DESC"
        }
      });
    }
    deleteList(ids: number[])  {
       return this.listRepository.delete(ids);
    }
    updateList(id: number, data: ListDto) {
       return this.listRepository.update(id , data)
    }
}
