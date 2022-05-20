import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/entities/teams.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto , UpdateStatus } from './interfaces/users.dto';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Team) private teamRepository: Repository<Team>,
    ) {}

    findOne(username: string) {
        return  this.usersRepository.findOne({
            select:['id','username','role','status','entity','access','password'],
            where :{
                username,
                status:"Active"
            },
            relations:['entity']
        });
    }

    insert(userDto: UserDto) {
        return this.usersRepository.save(userDto);
    }


    async seedsuperuser() {
        await this.teamRepository.delete({
            name:"admin"
        })
        const team = await this.teamRepository.save({
            name:"admin"
        })
        await this.usersRepository.delete({
            role:"IT",
            username:"admin"
        })
        const admin_user = Object.assign(new User() ,{
            username:"admin",
            password:process.env.ADMIN_PASS,
            access:"{All}",
            role:"IT",
            entity : team.id
            
        })
        return this.usersRepository.save(admin_user);
    }


    findAll() {
       return  this.usersRepository.find({
           relations:['entity'],
           order :{
               createdAt :"DESC"
           }
       });
    }

    update(id : number , userDto : UserDto) {
        return  this.usersRepository.update(id ,userDto);
    }

    updateStatus(id , userDto : UpdateStatus) {
        return  this.usersRepository.update(id ,userDto);
    }

    remove(ids :number[]) {
        return  this.usersRepository.delete(ids);
    }
}
