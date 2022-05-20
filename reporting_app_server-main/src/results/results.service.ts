import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult, Repository } from 'typeorm';
import { Result } from 'src/entities/results.entity';
import { ResultDto } from './interfaces/results';


@Injectable()
export class ResultsService {
    constructor(
        @InjectRepository(Result) private resultsRepository: Repository<Result>,
    ){}

    async insertResult(resultDto : ResultDto) {
        console.log("result dto",resultDto)
        const res = await this.resultsRepository.findOne({
            where :{
                seed:resultDto.seed,
                process:resultDto.process
            }
        })
        if(!res){
            return this.resultsRepository.insert(resultDto);
        }
    }

    findSeedResult(seed:number , process : number): Promise<Result> {
        return this.resultsRepository.findOne({
            relations:['seed' , 'process'],
            where :{
              seed,
              process
            },
        });
     }

    findAllResults(process:number): Promise<Result[]> {
       return this.resultsRepository.find({
           relations:['seed' , 'process'],
           where :{
             process
           },
           order :{
             createdAt:"ASC"
           }
       });
    }

    updateResult(process: any, resultDto: ResultDto):Promise<UpdateResult> {
        return this.resultsRepository.createQueryBuilder()
            .update(Result)
            .set({ ...resultDto })
            .where("processId = :process", { process })
            .execute();
    };

    updateSeedResult(seed: any, process: any , resultDto: ResultDto):Promise<UpdateResult> {
        return this.resultsRepository.createQueryBuilder()
            .update(Result)
            .set({ ...resultDto })
            .where("seedId = :seed", { seed })
            .andWhere("processId = :process", { process })
            .execute();
    };

    updateStatus(seed: any, resultDto: ResultDto):Promise<UpdateResult> {
        return this.resultsRepository.createQueryBuilder()
            .update(Result)
            .set({ ...resultDto })
            .where("seedId = :seed", { seed })
            .execute();
    };

    setToPaused = async (process:number , status:string) => {
        return await this.resultsRepository.createQueryBuilder()
        .update(Result)
        .set({ status })
        .where("processId = :process", { process })
        .andWhere("status != 'running'")
        .execute();
    }

    setToFailed = async (process:number , status:string) => {
        return await this.resultsRepository.createQueryBuilder()
        .update(Result)
        .set({ status })
        .where("processId = :process", { process })
        .andWhere("status != 'running'")
        .execute();
    }

    setToWaiting = async (process:number , status:string) => {
        return await this.resultsRepository.createQueryBuilder()
        .update(Result)
        .set({ status })
        .where("processId = :seed", { process })
        .andWhere("status != 'failed'")
        .execute();
    }
}
