import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entities/seeds.entity';
import { SeedDto } from './interfaces/seeds.tdo';


interface Ifilter {
    userId:number,
    entity:number,
    listId:number
}

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Seed) private seedRepository: Repository<Seed>,
      ) {}

    findOneSeed(id: number): Promise<Seed> {
         return this.seedRepository.findOneOrFail(id);
    }

    insertSeed(seedDto :SeedDto ) {
        return this.seedRepository.save(seedDto);
    }

    insertBulkSeed(seedDto :SeedDto[]) {
        return this.seedRepository.createQueryBuilder().insert().into("seeds").values(seedDto).execute()
    }

    async findAllSeeds(list : number): Promise<Seed[]> {
       return await this.seedRepository.find({
        where:{
          list
        },
        order:{
          createdAt:"DESC"
        }
      })
    }

    async findListSeeds(list:number): Promise<Seed[]> {
        return await this.seedRepository.find({
            where:{
              list
            },
            order:{
              createdAt:"DESC"
            }
        })
    }

    paginateLists(range : number[] , filter: Ifilter): Promise<[Seed[], number]> {
        return this.seedRepository.findAndCount({
            where:{ user:filter.userId , entity:filter.entity , list:filter.listId }
        })
    }
    deleteSeed(ids: number[]) {
       return this.seedRepository.delete(ids);
    }
    updateSeed(id: number, data: SeedDto) {
        return this.seedRepository.update({id} , {...data});
    }
}
