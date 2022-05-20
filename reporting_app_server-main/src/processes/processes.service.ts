import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Process } from '../entities/process.entity';
import { InsertResult, DeleteResult, UpdateResult, Repository, In } from 'typeorm';
import { ProcessDto, UpdateProcessDto } from './interfaces/process.tdo';
import { User } from 'src/entities/user.entity';


@Injectable()
export class ProcessService {
    constructor(
        @InjectRepository(Process) private processRepository: Repository<Process>,
        @InjectRepository(User) private userRepository: Repository<User>,
        ){}

    async findOneProcess(id: number): Promise<Process> {
        const process = await this.processRepository.findOne(id,{ relations:['list', 'list.seeds'] });
        return process;
    }

    async findProcessByIds(ids: number[]): Promise<Process[]> {
        const processes = await this.processRepository.find({
            where : {
                id : In(ids)
            },
        });
        return processes;
    }

    insertProcess(processDto : ProcessDto ) : Promise<InsertResult> {
        return this.processRepository.insert(processDto);
    }

    async findAllProcesses(user:number): Promise<Process[]> {
       const cuser = await this.userRepository.findOne({ 
           where:{
           id:user
          }, 
          order :{
              createdAt:"DESC"
          }
       })
       if(cuser.role === 'IT'){
          return await this.processRepository.find({
              relations:['list' , 'list.seeds' , 'user'],
              order :{
                createdAt:"DESC"
              }
          })
       }
       return await this.processRepository.find({
           where :{
               user,
           },
           relations:['list' , 'list.seeds' , 'user' ] ,
           order :{
            createdAt:"DESC"
           }
       });
    }

    deleteProcess(ids: number[]): Promise<DeleteResult> {
       return this.processRepository.delete(ids);
    }

    updateProcess(id: number, data: UpdateProcessDto): Promise<UpdateResult> {
       return this.processRepository.update(id , {...data});
    }
}
