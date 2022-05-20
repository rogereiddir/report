import { Controller, Get, Post, Body, Res, Delete, Put , Query , HttpStatus , HttpException, BadRequestException, Param} from '@nestjs/common';
import { SeedService } from './seeds.service';
import { ListService } from '../lists/lists.service';
import { Response } from 'express';
import { SeedDto } from './interfaces/seeds.tdo';
import { ResultsService } from 'src/results/results.service';

@Controller('api/v1/seeds')
export class SeedController {
    constructor(
        private readonly seedService: SeedService , 
        private readonly listService: ListService,
        private readonly resultsService: ResultsService
        ) {}

    @Get(':id')
    findListSeeds(@Param('id') id :number) {
     try {
        return this.seedService.findListSeeds(id);
     } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
     }
    }

    
    @Get('one/:id')
    findOneSeed(@Param('id') id :number) {
     try {
        return this.seedService.findOneSeed(id);
     } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
     }
    }

    @Get()
    paginate(@Query('filter') filter : string , @Query('range') range : string) {
        try {
            if(range && filter){
                return this.seedService.paginateLists(JSON.parse(range),JSON.parse(filter));
            }else{
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "must include pagination data",
                }, 400);
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }
    @Post('create')
    async createSeed(@Body() seedDto : SeedDto , @Res() res: Response): Promise<Response> {
       try {
        await this.seedService.insertSeed(seedDto);
        return res.status(200).json({message: 'Seed Created'});
       } catch (error) {
        throw new BadRequestException({
            error: error.message,
        }); 
       }
    }

    @Post('bulk_create')
    async createBulkSeed(@Body('records') seedDto : SeedDto[] ,  @Body('id') id : number , @Res() res: Response): Promise<Response> {
       try {
        const data = await this.seedService.insertBulkSeed(seedDto);
        const list = await this.listService.findOneList(id)
         for (const process of list.processes) {
              const resultss = list.seeds.map((seed) => (
                this.resultsService.insertResult({
                    seed,
                    process
                })
             ))
            const results = await Promise.all(resultss)
         }
       
        await this.listService.updateList(id , {count:list.count + data.identifiers.length})
        return res.status(200).json({message: `${seedDto.length} Created`});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            detail:error.detail,
            error: error.message,
        }, 400); 
       }
    }

    @Delete('delete')
    async deleteSeed(@Query('filter') filter, @Res() res: Response): Promise<Response> {
       try {
        if(filter){
            const ids = JSON.parse(filter).ids
            const listId = JSON.parse(filter).listId
            const list = await this.listService.findOneList(listId)
            const data = await this.seedService.deleteSeed(ids);
            list.count  !== 0 ? await this.listService.updateList(listId , {count: list.count - data.affected}) : 
            await this.listService.updateList(listId , {count: list.count }) 
            return res.status(200).json({message: 'Seeds Deleted'});
        }else{
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "No Ids provided",
            }, 400);
        }
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error:error.message,
        }, 400);
       } 
    }
    @Put('update')
    async updateSeed(@Body('id') id: number, @Body() body: SeedDto, @Res() res: Response): Promise<Response> {
        await this.seedService.updateSeed(id, body);
        return res.status(200).json({message: 'Seed Updated'});
    }
}
