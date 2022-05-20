import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthIpDto } from './interfaces/auth_ips.dto';
import { Repository } from 'typeorm';
import { AuthIp } from 'src/entities/authIp.entity';

@Injectable()
export class AuthIpsService {
    constructor(
        @InjectRepository(AuthIp) private authIpsRepository: Repository<AuthIp>
      ) {}
    findOneIP(id: number) {
        return  this.authIpsRepository.findOne(id)
    }
    findOne(ip: string) {
        return  this.authIpsRepository.findOne({
            ip
        })
    }
    insertIP( data :AuthIpDto ) {
        return this.authIpsRepository.insert(data);
    }

    findIps() {
        return this.authIpsRepository.find({
         select:['ip'],
         order :{
             createdAt:'DESC'
         }
        });
     }

    findAllIPS() {
       return this.authIpsRepository.find({
        relations:['entity'],
        order :{
            createdAt:'DESC'
        }
       });
    }

    deleteIP(ids: number[]) {
        return this.authIpsRepository.delete(ids);
    }

    updateIP(id: number, data: AuthIpDto) {
        return this.authIpsRepository.update(id, data);
    }
}
