import { Controller, Get, Post, Body, Res, Delete, Put , HttpException , HttpStatus , Query , Param, UseInterceptors, UploadedFile, CacheInterceptor, CACHE_MANAGER, Inject, CacheKey, UseGuards} from '@nestjs/common';
import { ProcessService } from './processes.service';
import { Response } from 'express';
import * as shortid from 'shortid';
import { ProcessDto, UpdateProcessDto } from './interfaces/process.tdo';
import { ListService } from 'src/lists/lists.service';
import { ResultsService } from 'src/results/results.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Cache } from 'cache-manager';
import { GlobalGuard } from 'src/guards/global.guard';

@Controller('api/v1/processes')
@UseGuards(GlobalGuard)
export class ProcessController {
    constructor(
        private readonly processService: ProcessService,
        private readonly listService: ListService,
        private readonly resultsService: ResultsService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get()
    async findAll(@Query('filter') filter : string  , @Res() res: Response) {
        try {
            const { userId } = JSON.parse(filter)
            const cached = await this.cacheManager.get(userId);
            if (cached) {
                return res.status(HttpStatus.OK).json(cached);  
            }else{
                const processes =  await this.processService.findAllProcesses(userId); 
                await this.cacheManager.set(userId, processes);
                return res.status(HttpStatus.OK).json(processes);   
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Get('results/:id')
    findProcessResults(@Param('id') id : number ) {
        try {
            return this.resultsService.findAllResults(id);    
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Get('one/:id/:prc')
    findProcessResult(@Param('id') id : number , @Param('prc') prc : number) {
        try {
            return this.resultsService.findSeedResult(id,prc);    
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Get(':id')
    async findOneProcess(@Param('id') id : number , @Res() res: Response ): Promise<Response> {
        try {
            const process =  await this.processService.findOneProcess(id);
            return res.status(HttpStatus.OK).json(process);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('file' ,{
        storage :diskStorage({
            destination: function (req, file, cb) {
                cb(null,'contacts/')
            },
            filename: function (req, file, cb) {
                cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname )
            }
        })
    }))
    async createProcess(@UploadedFile() file: Express.Multer.File , @Body() processDto : any, @Res() res: Response): Promise<Response> {
        try {
            console.log(processDto)
            processDto.name = shortid.generate()
            const list = await this.listService.findOne(processDto.list);
            if(list.seeds.length === 0){
                return res.status(HttpStatus.BAD_REQUEST).json({message: 'List you selected is Empty'});
            }
            const data = await this.processService.insertProcess({
                ...processDto,
                file:file?.filename || ""
            });
            const process = await this.processService.findOneProcess(data.identifiers[0].id);
            const resultss = list.seeds.map((seed) => (
                this.resultsService.insertResult({
                    seed,
                    process
                })
            ))
            const results = await Promise.all(resultss)
            return res.status(HttpStatus.CREATED).json({message: 'Process Created'});
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Delete('delete')
    async deleteProcess(@Query('filter') filter, @Res() res: Response): Promise<Response> {
        try {
            const ids = JSON.parse(filter).ids
            const processes = await this.processService.findProcessByIds(ids);
            if(processes.some(ps => ps.status === 'running')){
              return res.status(HttpStatus.BAD_REQUEST).json({message: 'Please Wait for processes to be stopped'});
            }
            await this.processService.deleteProcess(ids);
            return res.status(HttpStatus.OK).json({message: 'Process Deleted'});
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }
    
    @Put('update/:id')
    async updateProcess(@Body('id') id: number, @Body() body: UpdateProcessDto, @Res() res: Response): Promise<Response> {
        try {
            await this.processService.updateProcess(id, body);
            return res.status(HttpStatus.OK).json({message: 'Process Updated'});
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
              }, 400);
        }
    }
}
